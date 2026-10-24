import { cn } from "@/lib/utils";
import StatusPill from "@/components/StatusPill";
import { formatReading, STATUS_STYLES } from "@/lib/water";

export default function MetricCard({ label, value, unit, status = "safe", limit, icon: Icon, note }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.unknown;
  return (
    <div className={cn("relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5")}>
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          status === "safe" && "bg-emerald-500",
          status === "warn" && "bg-amber-500",
          status === "danger" && "bg-rose-500",
          status === "unknown" && "bg-border"
        )}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </div>
        <span className={cn("h-2 w-2 rounded-full", style.dot)} />
      </div>
      <p className="mt-3 font-mono text-[26px] leading-none tracking-tight">
        {formatReading(value)}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">{unit}</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[10.5px] text-muted-foreground">{limit}</span>
        <StatusPill status={status} />
      </div>
      {note && <p className="mt-2 text-[10.5px] leading-relaxed text-muted-foreground/80">{note}</p>}
    </div>
  );
}
