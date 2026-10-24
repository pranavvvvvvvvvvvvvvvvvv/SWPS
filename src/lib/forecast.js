const HOUR = 3600000;

const round1 = (n) => Math.round(n * 10) / 10;

export const HORIZONS = [
  { key: 3, label: "3h" },
  { key: 6, label: "6h" },
  { key: 12, label: "12h" },
  { key: 24, label: "24h" },
];

/** Readings for one parameter inside the training window, oldest first. */
export function historyPoints(readings, key, windowHours = 72) {
  const cutoff = Date.now() - windowHours * HOUR;
  return (readings || [])
    .filter((r) => r[key] !== null && r[key] !== undefined && !Number.isNaN(Number(r[key])))
    .map((r) => ({ ts: new Date(r.recorded_at).getTime(), value: Number(r[key]) }))
    .filter((p) => Number.isFinite(p.ts) && p.ts >= cutoff)
    .sort((a, b) => a.ts - b.ts);
}

/** Least-squares fit: slope per hour, plus R² used as the confidence measure. */
function fit(points) {
  const n = points.length;
  const t0 = points[0].ts;
  const xs = points.map((p) => (p.ts - t0) / HOUR);
  const ys = points.map((p) => p.value);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = den ? num / den : 0;

  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i += 1) {
    const predicted = my + slope * (xs[i] - mx);
    ssTot += (ys[i] - my) ** 2;
    ssRes += (ys[i] - predicted) ** 2;
  }
  return { slope, r2: ssTot ? Math.max(0, 1 - ssRes / ssTot) : 0 };
}

/** Projects one parameter forward from its recent trend, hourly steps. */
export function forecastMetric(readings, key, { horizonHours = 6, windowHours = 72 } = {}) {
  const points = historyPoints(readings, key, windowHours);
  if (points.length < 3) {
    return { key, ok: false, points, sampleCount: points.length };
  }

  const { slope, r2 } = fit(points);
  const last = points[points.length - 1];
  const steps = Math.max(1, Math.round(horizonHours));

  const forecast = Array.from({ length: steps }, (_, i) => {
    const ts = last.ts + (i + 1) * HOUR;
    return { ts, value: round1(last.value + slope * ((ts - last.ts) / HOUR)) };
  });

  const projected = forecast[forecast.length - 1].value;

  return {
    key,
    ok: true,
    points,
    forecast,
    sampleCount: points.length,
    current: round1(last.value),
    projected,
    delta: round1(projected - last.value),
    slopePerHour: slope,
    trend: slope > 0.02 ? "rising" : slope < -0.02 ? "falling" : "steady",
    confidence: r2 >= 0.5 ? "strong" : r2 >= 0.2 ? "moderate" : "weak",
    r2,
  };
}

/** Hours until the current trend reaches a safe limit, or null if it never does in that direction. */
export function hoursToLimit(key, current, slopePerHour, limits) {
  const cfg = limits?.[key];
  if (!cfg || !Number.isFinite(current) || !Number.isFinite(slopePerHour) || !slopePerHour) return null;

  const candidates = [];
  const check = (target, direction) => {
    if (target === undefined || target === null) return;
    const hours = (target - current) / slopePerHour;
    if (hours > 0 && hours <= 24 * 7) candidates.push({ hours, target, direction });
  };

  if (key === "level") {
    check(cfg.min, "below");
  } else if (key === "temperature") {
    check(cfg.max, "above");
    check(cfg.min, "below");
  } else {
    check(cfg.max, "above");
  }

  return candidates.sort((a, b) => a.hours - b.hours)[0] || null;
}

export function formatHours(hours) {
  if (hours === null || hours === undefined) return "—";
  if (hours < 1) return `${Math.max(5, Math.round(hours * 60))} min`;
  return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)} h`;
}
