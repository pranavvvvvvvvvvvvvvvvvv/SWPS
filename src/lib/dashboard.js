import { DEFAULT_LIMITS } from "@/lib/water";
import { format } from "date-fns";

export const RANGES = [
  { key: "1h", label: "1h", hours: 1 },
  { key: "24h", label: "24h", hours: 24 },
  { key: "7d", label: "7d", hours: 24 * 7 },
  { key: "30d", label: "30d", hours: 24 * 30 },
];

export function rangeStart(rangeKey) {
  const range = RANGES.find((r) => r.key === rangeKey) || RANGES[1];
  // Rounded to a 5-minute bucket so the value is stable across re-renders
  // (a millisecond-precise timestamp would create a new query on every render).
  const bucket = 5 * 60 * 1000;
  const cutoff = Date.now() - range.hours * 3600000;
  return new Date(Math.floor(cutoff / bucket) * bucket).toISOString();
}

export function thresholdsFrom(row) {
  if (!row) return DEFAULT_LIMITS;
  return {
    tds: { max: row.tds_max ?? 500, warn: row.tds_warn ?? 300, unit: "ppm", label: "TDS" },
    turbidity: { max: row.turbidity_max ?? 5, warn: row.turbidity_warn ?? 3, unit: "NTU", label: "Turbidity" },
    temperature: { max: row.temp_max ?? 30, min: row.temp_min ?? 10, unit: "°C", label: "Temperature" },
    level: { min: row.level_min ?? 20, unit: "%", label: "Water level" },
  };
}

/** Maintenance urgency: low filter health, many cycles, active critical alerts and staleness. */
export function maintenanceScore(device, alerts = []) {
  const health = Number(device.filter_health ?? 100);
  const cycles = Number(device.total_cycles ?? 0);
  const related = alerts.filter((a) => a.device_code === device.code && a.status !== "resolved");
  const criticals = related.filter((a) => a.severity === "critical").length;
  const warnings = related.filter((a) => a.severity === "warning").length;
  const hoursSince = device.last_seen ? (Date.now() - new Date(device.last_seen).getTime()) / 3600000 : 999;

  let score = (100 - health) * 0.55 + Math.min(cycles * 1.4, 28) + criticals * 9 + warnings * 3;
  if (hoursSince > 6) score += 10;
  score = Math.round(Math.min(100, score));

  const urgency = score >= 60 ? "urgent" : score >= 35 ? "soon" : "routine";
  const reasons = [];
  if (health < 60) reasons.push(`Filter health ${health}%`);
  if (cycles > 15) reasons.push(`${cycles} re-filter cycles logged`);
  if (criticals) reasons.push(`${criticals} active critical alert`);
  if (hoursSince > 6) reasons.push("Device not reporting");
  if (!reasons.length) reasons.push("Within normal operating range");

  return { score, urgency, reasons, related };
}

export const URGENCY_STYLES = {
  urgent: {
    label: "Replace now",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25",
    bar: "bg-rose-500",
  },
  soon: {
    label: "Schedule soon",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25",
    bar: "bg-amber-500",
  },
  routine: {
    label: "Routine",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
    bar: "bg-emerald-500",
  },
};

export function downloadCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function dayKey(dateish) {
  return format(new Date(dateish), "yyyy-MM-dd");
}

export function summarise(readings) {
  const total = readings.length;
  const unsafe = readings.filter((r) => r.decision === "unsafe").length;
  const avg = (key) =>
    total ? Math.round((readings.reduce((sum, r) => sum + Number(r[key] || 0), 0) / total) * 10) / 10 : 0;
  return {
    total,
    unsafe,
    safe: total - unsafe,
    safePct: total ? Math.round(((total - unsafe) / total) * 1000) / 10 : 0,
    avgTds: avg("tds"),
    avgTurbidity: avg("turbidity"),
    avgTemperature: avg("temperature"),
    avgLevel: avg("level"),
  };
}
