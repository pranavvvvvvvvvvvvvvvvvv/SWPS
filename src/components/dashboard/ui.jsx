import { cn } from "@/lib/utils";

export function DeviceSelect({ devices = [], value, onChange, includeAll = true, label = "Unit" }) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 max-w-[240px] rounded-full border border-border bg-card px-3 pr-7 text-[12px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {includeAll && <option value="all">All units</option>}
        {!includeAll && <option value="">Select a unit</option>}
        {devices.map((d) => (
          <option key={d.code} value={d.code}>
            {d.code} · {d.village}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RangeTabs({ value, onChange, ranges }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-0.5">
      {ranges.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={() => onChange(r.key)}
          className={cn(
            "rounded-full px-3 py-1 text-[11.5px] font-semibold transition",
            value === r.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function Panel({ title, subtitle, action, children, className }) {
  return (
    <section className={cn("min-w-0 rounded-2xl border border-border bg-card", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div>
            {title && <h2 className="text-[13.5px] font-bold leading-tight">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function EmptyState({ title, hint, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center">
      {Icon && <Icon className="mb-3 h-5 w-5 text-muted-foreground/60" />}
      <p className="text-[12.5px] font-medium">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}
