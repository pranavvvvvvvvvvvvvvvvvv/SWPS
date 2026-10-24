// WHO-aligned default limits. Per-device thresholds override these on the dashboard.
export const DEFAULT_LIMITS = {
  tds: { max: 500, warn: 300, unit: "ppm", label: "TDS", icon: "droplets" },
  turbidity: { max: 5, warn: 3, unit: "NTU", label: "Turbidity", icon: "waves" },
  temperature: { max: 30, min: 10, unit: "°C", label: "Temperature", icon: "thermometer" },
  level: { min: 20, unit: "%", label: "Water level", icon: "gauge" },
};

export const READING_META = [
  { key: "tds", label: "TDS", unit: "ppm", limit: "≤ 500", color: "chart-1" },
  { key: "turbidity", label: "Turbidity", unit: "NTU", limit: "≤ 5", color: "chart-2" },
  { key: "temperature", label: "Temperature", unit: "°C", limit: "10–30", color: "chart-3" },
  { key: "level", label: "Water level", unit: "%", limit: "≥ 20", color: "chart-5" },
];

export function readingStatus(key, value, limits = DEFAULT_LIMITS) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "unknown";
  const v = Number(value);
  const cfg = limits[key] || DEFAULT_LIMITS[key];
  if (!cfg) return "safe";

  if (key === "tds") {
    if (v > cfg.max) return "danger";
    if (v > cfg.warn) return "warn";
    return "safe";
  }
  if (key === "turbidity") {
    if (v > cfg.max) return "danger";
    if (v > cfg.warn) return "warn";
    return "safe";
  }
  if (key === "temperature") {
    if (v > cfg.max || v < (cfg.min ?? 0)) return "danger";
    if (v > cfg.max - 3) return "warn";
    return "safe";
  }
  if (key === "level") {
    if (v < (cfg.min ?? 20) / 2) return "danger";
    if (v < (cfg.min ?? 20)) return "warn";
    return "safe";
  }
  return "safe";
}

export const STATUS_STYLES = {
  safe: {
    label: "Safe",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500 text-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
    ring: "ring-emerald-500/25",
  },
  warn: {
    label: "Watch",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500 text-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25",
    ring: "ring-amber-500/25",
  },
  danger: {
    label: "Unsafe",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500 text-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25",
    ring: "ring-rose-500/25",
  },
  unknown: {
    label: "No data",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground text-muted-foreground",
    chip: "bg-muted text-muted-foreground border-border",
    ring: "ring-border",
  },
};

export function overallStatus(readings) {
  if (!readings) return "unknown";
  const order = ["danger", "warn", "safe"];
  const states = ["tds", "turbidity", "temperature", "level"].map((k) => readingStatus(k, readings[k]));
  return order.find((s) => states.includes(s)) || "safe";
}

export function formatReading(value, unit) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return `${Number.isInteger(n) ? n : n.toFixed(1)}${unit ? ` ${unit}` : ""}`;
}

export function relativeTime(dateish) {
  if (!dateish) return "never";
  const then = new Date(dateish).getTime();
  const diff = Date.now() - then;
  if (Number.isNaN(then)) return "—";
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} d ago`;
}
