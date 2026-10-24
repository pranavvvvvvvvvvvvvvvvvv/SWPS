import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { readingStatus, formatReading } from "@/lib/water";
import { formatHours } from "@/lib/forecast";
import StatusPill from "@/components/StatusPill";
import { cn } from "@/lib/utils";

const TREND = {
  rising: { icon: ArrowUpRight, text: "rising", tone: "text-rose-600 dark:text-rose-400" },
  falling: { icon: ArrowDownRight, text: "falling", tone: "text-sky-600 dark:text-sky-400" },
  steady: { icon: ArrowRight, text: "steady", tone: "text-muted-foreground" },
};

export default function ForecastCard({ meta, forecast, limits, horizon, crossing, active, onSelect }) {
  const Icon = meta.icon;
  const status = forecast?.ok ? readingStatus(meta.key, forecast.projected, limits) : "unknown";
  const trend = TREND[forecast?.trend] || TREND.steady;
  const TrendIcon = trend.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-w-0 rounded-2xl border bg-card p-4 text-left transition",
        active ? "border-primary/40 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        {forecast?.ok && (
          <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-medium", trend.tone)}>
            <TrendIcon className="h-3 w-3" />
            {trend.text}
          </span>
        )}
      </div>

      <p className="mt-2.5 font-mono text-[21px] leading-none">
        {forecast?.ok ? formatReading(forecast.projected, "") : "—"}
        <span className="ml-1 text-[11px] font-body text-muted-foreground">{meta.unit}</span>
      </p>

      <p className="mt-1 text-[10.5px] text-muted-foreground">
        {forecast?.ok ? `now ${formatReading(forecast.current, "")} · in ${horizon} h` : "awaiting samples"}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <StatusPill status={status} />
        {crossing && crossing.hours <= horizon && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9.5px] font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
            limit in {formatHours(crossing.hours)}
          </span>
        )}
      </div>

      {forecast?.ok && (
        <p className="mt-2 text-[9.5px] text-muted-foreground/80">
          {forecast.confidence} trend · {forecast.sampleCount} samples
        </p>
      )}
    </button>
  );
}
