// Shared purification control logic — used by the ESP32 ingestion endpoint,
// the device simulator and the seed routine. Never duplicate this elsewhere.

export const WHO_DEFAULTS = {
  tds_max: 500,
  tds_warn: 300,
  turbidity_max: 5,
  turbidity_warn: 3,
  temp_min: 10,
  temp_max: 30,
  level_min: 20,
};

export function firstOf(result) {
  if (!result) return null;
  if (Array.isArray(result)) return result[0] || null;
  if (Array.isArray(result.items)) return result.items[0] || null;
  return null;
}

export function allOf(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  return Array.isArray(result.items) ? result.items : [];
}

/**
 * Compare a set of readings against a device's safe envelope.
 * Returns the status, the decision the valve should follow, and which limits failed.
 */
export function evaluate(values, thresholds) {
  const t = { ...WHO_DEFAULTS, ...(thresholds || {}) };
  const failures = [];
  const warnings = [];

  const tds = Number(values.tds);
  const turbidity = Number(values.turbidity);
  const temperature = Number(values.temperature);
  const level = Number(values.level);

  if (tds > t.tds_max) failures.push({ key: "tds", label: "TDS", value: tds, limit: t.tds_max, unit: "ppm", direction: "above" });
  else if (tds > t.tds_warn) warnings.push({ key: "tds", label: "TDS", value: tds, limit: t.tds_warn, unit: "ppm", direction: "above" });

  if (turbidity > t.turbidity_max) failures.push({ key: "turbidity", label: "Turbidity", value: turbidity, limit: t.turbidity_max, unit: "NTU", direction: "above" });
  else if (turbidity > t.turbidity_warn) warnings.push({ key: "turbidity", label: "Turbidity", value: turbidity, limit: t.turbidity_warn, unit: "NTU", direction: "above" });

  if (temperature > t.temp_max || temperature < t.temp_min) {
    failures.push({ key: "temperature", label: "Temperature", value: temperature, limit: temperature > t.temp_max ? t.temp_max : t.temp_min, unit: "°C", direction: temperature > t.temp_max ? "above" : "below" });
  }

  if (level < t.level_min) failures.push({ key: "level", label: "Water level", value: level, limit: t.level_min, unit: "%", direction: "below" });

  const status = failures.length ? "danger" : warnings.length ? "warn" : "safe";

  return {
    status,
    decision: failures.length ? "unsafe" : "safe",
    valve: failures.length ? "held" : "released",
    failures,
    warnings,
    thresholds: t,
  };
}

export function describeFailures(failures) {
  return failures
    .map((f) => `${f.label} ${f.value}${f.unit} (limit ${f.direction === "above" ? "≤" : "≥"} ${f.limit}${f.unit})`)
    .join(", ");
}

/**
 * Persist one reading, update the device and log every decision the controller took.
 * `base44` is a client (service role or user scoped) supplied by the caller.
 */
export async function recordReading(base44, device, values, recordedAt, source = "sensor") {
  const thresholdRow = firstOf(await base44.entities.Threshold.filter({ device_code: device.code }, { limit: 1 }));
  const evaluation = evaluate(values, thresholdRow);
  const unsafe = evaluation.decision === "unsafe";

  const previousCycle = Number(device.total_cycles || 0);
  const cycle = unsafe ? previousCycle + 1 : 0;

  const reading = await base44.entities.Reading.create({
    device_code: device.code,
    device_name: device.name,
    village: device.village,
    tds: Number(values.tds),
    turbidity: Number(values.turbidity),
    temperature: Number(values.temperature),
    level: Number(values.level),
    recorded_at: recordedAt,
    decision: evaluation.decision,
    status: evaluation.status,
    valve: evaluation.valve,
    cycle,
    source,
  });

  const healthDrop = unsafe ? 6 : 0.25;
  const filterHealth = Math.max(0, Math.min(100, Number(device.filter_health ?? 100) - healthDrop));

  await base44.entities.Device.update(device.id, {
    last_seen: recordedAt,
    status: "online",
    filter_health: Math.round(filterHealth * 10) / 10,
    total_cycles: unsafe ? cycle : previousCycle,
  });

  const logBase = {
    device_code: device.code,
    device_name: device.name,
    village: device.village,
    tds: Number(values.tds),
    turbidity: Number(values.turbidity),
    temperature: Number(values.temperature),
    level: Number(values.level),
    cycle,
    logged_at: recordedAt,
  };

  if (unsafe) {
    await base44.entities.ControlLog.create({
      ...logBase,
      stage: "hold",
      decision: "unsafe",
      valve: "held",
      detail: `Limit exceeded — ${describeFailures(evaluation.failures)}. Release valve held closed, re-filtration cycle ${cycle} started.`,
    });

    await base44.entities.Alert.create({
      device_code: device.code,
      device_name: device.name,
      village: device.village,
      type: evaluation.failures[0].key,
      severity: "critical",
      message: `Unsafe water at ${device.name}: ${describeFailures(evaluation.failures)}. Water held back; re-filtering.`,
      reading_value: evaluation.failures[0].value,
      threshold_value: evaluation.failures[0].limit,
      unit: evaluation.failures[0].unit,
      status: "active",
      raised_at: recordedAt,
      notify_channels: "email,sms,push",
    });
  } else {
    await base44.entities.ControlLog.create({
      ...logBase,
      stage: "release",
      decision: "safe",
      valve: "released",
      detail:
        evaluation.warnings.length > 0
          ? `Within safe limits but approaching a threshold (${describeFailures(evaluation.warnings)}). Water released with a monitoring flag.`
          : "All four parameters inside the safe envelope. Water released to storage.",
    });
  }

  return { reading, evaluation };
}
