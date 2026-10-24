import { useEffect, useMemo, useState } from "react";
import { Droplets, Gauge, Minus, Thermometer, TrendingDown, TrendingUp, Waves } from "lucide-react";
import { useDevices, useReadings, useThresholds } from "@/hooks/useSwps";
import { thresholdsFrom } from "@/lib/dashboard";
import { formatReading, readingStatus, STATUS_STYLES } from "@/lib/water";
import { HORIZONS, forecastMetric, formatHours, hoursToLimit } from "@/lib/forecast";
import { DeviceSelect, RangeTabs } from "@/components/dashboard/ui";
import ForecastChart from "@/components/dashboard/ForecastChart";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { cn } from "@/lib/utils";

const PARAMS = [
  { key: "tds", label: "TDS", unit: "ppm", icon: Droplets, color: "hsl(var(--chart-1))" },
  { key: "turbidity", label: "Turbidity", unit: "NTU", icon: Waves, color: "hsl(var(--chart-2))" },
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer, color: "hsl(var(--chart-3))" },
  { key: "level", label: "Water level", unit: "%", icon: Gauge, color: "hsl(var(--chart-5))" },
];

const TREND = {
  rising: { icon: TrendingUp, text: "rising" },
  falling: { icon: TrendingDown, text: "falling" },
  steady: { icon: Minus, text: "steady" },
};

export default function ForecastPreview() {
  const tr = useAutoTranslate();
  const [deviceCode, setDeviceCode] = useState("");
  const [horizon, setHorizon] = useState(6);
  const [param, setParam] = useState("tds");

  const { data: devices = [] } = useDevices();
  const { data: thresholds = [] } = useThresholds();
  const { data: readings = [] } = useReadings({ deviceCode: deviceCode || "__none__", limit: 800 });

  useEffect(() => {
    if (!deviceCode && devices.length) setDeviceCode(devices[0].code);
  }, [devices, deviceCode]);

  const limits = useMemo(
    () => thresholdsFrom(thresholds.find((t) => t.device_code === deviceCode)),
    [thresholds, deviceCode]
  );

  const forecasts = useMemo(
    () =>
      PARAMS.reduce((acc, p) => {
        const f = forecastMetric(readings, p.key, { horizonHours: horizon });
        acc[p.key] = { ...f, crossing: f.ok ? hoursToLimit(p.key, f.current, f.slopePerHour, limits) : null };
        return acc;
      }, {}),
    [readings, horizon, limits]
  );

  const selected = PARAMS.find((p) => p.key === param);
  const active = forecasts[param];
  const chartLimit = param === "level" ? limits.level?.min : limits[param]?.max;
  const breaches = PARAMS.filter((p) => forecasts[p.key]?.crossing && forecasts[p.key].crossing.hours <= horizon);
  const worst = ["danger", "warn"].find((s) =>
    PARAMS.some((p) => forecasts[p.key]?.ok && readingStatus(p.key, forecasts[p.key].projected, limits) === s)
  );

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-bold leading-tight">{tr("Live forecast")}</h3>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {tr("From the readings currently on record for this unit.")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DeviceSelect devices={devices} value={deviceCode} onChange={setDeviceCode} includeAll={false} />
          <RangeTabs value={horizon} onChange={setHorizon} ranges={HORIZONS} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PARAMS.map((p) => {
          const f = forecasts[p.key];
          const Icon = p.icon;
          const trend = TREND[f?.trend] || TREND.steady;
          const TrendIcon = trend.icon;
          const status = f?.ok ? readingStatus(p.key, f.projected, limits) : "unknown";
          const style = STATUS_STYLES[status];
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setParam(p.key)}
              className={cn(
                "min-w-0 rounded-xl border bg-background p-3.5 text-left transition",
                param === p.key ? "border-primary/40 ring-1 ring-primary/15" : "border-border hover:border-primary/30"
              )}
            >
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <Icon className="h-3 w-3" />
                {tr(p.label)}
              </span>
              <p className="mt-2 font-mono text-[19px] leading-none">
                {f?.ok ? formatReading(f.projected, "") : "—"}
                <span className="ml-1 font-body text-[10.5px] text-muted-foreground">{p.unit}</span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-[10.5px] text-muted-foreground">
                <TrendIcon className="h-3 w-3" />
                {f?.ok ? tr(`${trend.text} · in ${horizon} h`) : tr("awaiting samples")}
              </p>
              <span className={cn("mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold", style.text)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                {tr(style.label)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background p-3">
        {active?.ok ? (
          <ForecastChart
            history={active.points}
            forecast={active.forecast}
            unit={selected.unit}
            label={selected.label}
            color={selected.color}
            limit={chartLimit}
            height={250}
          />
        ) : (
          <div className="flex h-[250px] flex-col items-center justify-center text-center">
            <p className="text-[12.5px] font-medium text-muted-foreground">{tr("Not enough history to project")}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">{tr("Three or more recent samples are needed.")}</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-muted-foreground">
        {breaches.length
          ? tr(
              `${breaches.map((b) => b.label).join(", ")} trending toward a limit within ${horizon} h${
                breaches[0].forecast.crossing ? ` — earliest in about ${formatHours(breaches[0].forecast.crossing.hours)}` : ""
              }.`
            )
          : worst
          ? tr(`A limit is approached inside ${horizon} h — the unit would stay on adaptive control.`)
          : tr(`No parameter is trending toward its limit inside ${horizon} h.`)}
      </p>
    </div>
  );
}
