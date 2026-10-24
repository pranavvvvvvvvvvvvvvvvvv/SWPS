import { Link } from "react-router-dom";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CloudOff,
  FileDown,
  Filter,
  Globe2,
  History,
  Map,
  Radio,
  RefreshCw,
  Scale,
  ShieldCheck,
  Smartphone,
  Siren,
  Wifi,
} from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const HERO_FEATURES = [
  {
    icon: RefreshCw,
    title: "Adaptive Purification Control",
    lead: "The unit corrects itself before a person is involved.",
    points: [
      "Every reading is evaluated against the unit's own threshold set, on the device.",
      "A failing parameter closes the release valve and restarts the carbon + RO cycle.",
      "Cycle count and outcome are logged, so a filter that keeps failing becomes visible.",
      "Escalation after repeated failures — the system stops trying and calls for a human.",
    ],
  },
  {
    icon: Siren,
    title: "Remote Alerts",
    lead: "The right person hears about it in minutes, not on the next visit.",
    points: [
      "Severity levels: critical (unsafe water), warning (approaching a limit), maintenance.",
      "Email, SMS and push delivery hooks, with per-alert acknowledgement tracking.",
      "Alerts carry the reading, the threshold it broke and the action already taken.",
      "Unacknowledged critical alerts escalate to the next role in the chain.",
    ],
  },
  {
    icon: Map,
    title: "Multi-point Cloud Dashboard",
    lead: "One view of every unit across every village.",
    points: [
      "Live cards for TDS, turbidity, temperature and level with green / amber / red status.",
      "Map view with colour-coded markers and side-by-side location comparison.",
      "Maintenance priority ranking built from filter health and failure frequency.",
      "CSV and PDF exports for daily, weekly and monthly reporting.",
    ],
  },
];

const SUPPORTING = [
  { icon: ShieldCheck, t: "Per-device thresholds", d: "WHO-based defaults, adjustable per site by a health officer." },
  { icon: CloudOff, t: "Offline tolerance", d: "Device keeps deciding locally; readings queue until the link returns." },
  { icon: History, t: "Full decision history", d: "Every reading, decision and re-filter cycle retained for audit." },
  { icon: CalendarClock, t: "Filter health scoring", d: "Runtime, cycle count and turbidity trend combined into one score." },
  { icon: Globe2, t: "Three languages", d: "English, Telugu and Hindi across the public site and dashboard." },
  { icon: Smartphone, t: "Mobile-first", d: "Built for a low-bandwidth phone in the field, installable as a PWA." },
  { icon: Scale, t: "Manual cross-checks", d: "Handheld test-kit readings logged beside sensor values for accuracy checks." },
  { icon: FileDown, t: "Exportable reports", d: "Download the exact readings behind any summary as CSV or PDF." },
];

const DECISION_TABLE = [
  { condition: "All four parameters inside limits", action: "Release water", tone: "safe" },
  { condition: "Any parameter above its limit", action: "Hold valve · re-filter", tone: "warn" },
  { condition: "Second consecutive failed cycle", action: "Critical alert · lock out", tone: "danger" },
  { condition: "Water level below 20 %", action: "Stop pump · warn operator", tone: "warn" },
  { condition: "No reading for 15 minutes", action: "Offline alert to operator", tone: "danger" },
];

export default function Features() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("Features")}
        title={tr("Detection, decision and action in the same system.")}
        description={tr(
          "These are the parts that make SWPS a control system rather than a reporting tool."
        )}
      />

      <Section>
        <div className="space-y-4">
          {HERO_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card-surface grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h2 className="mt-4 text-[21px] font-bold leading-snug">{tr(f.title)}</h2>
                  <p className="mt-2 text-[14px] font-medium text-primary/90">{tr(f.lead)}</p>
                </div>
                <ul className="space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {tr(p)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow={tr("Control logic")}
            title={tr("What the unit does, and when.")}
            description={tr(
              "A single deterministic rule set — small enough to audit, strict enough to matter."
            )}
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">{tr("Condition")}</th>
                  <th className="px-4 py-3 font-semibold">{tr("Automatic action")}</th>
                </tr>
              </thead>
              <tbody>
                {DECISION_TABLE.map((row) => (
                  <tr key={row.condition} className="border-t border-border/70">
                    <td className="px-5 py-3.5">{tr(row.condition)}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={
                          row.tone === "safe"
                            ? "inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400"
                            : row.tone === "warn"
                            ? "inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400"
                            : "inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-400"
                        }
                      >
                        <span
                          className={
                            row.tone === "safe"
                              ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                              : row.tone === "warn"
                              ? "h-1.5 w-1.5 rounded-full bg-amber-500"
                              : "h-1.5 w-1.5 rounded-full bg-rose-500"
                          }
                        />
                        {tr(row.action)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="center"
          eyebrow={tr("Supporting capabilities")}
          title={tr("The smaller pieces that make it deployable.")}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORTING.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="h-4.5 w-4.5 text-primary" />
                <h3 className="mt-3 text-[13px] font-semibold">{tr(s.t)}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{tr(s.d)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-secondary/50 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-[16px] font-bold">{tr("Try the dashboard")}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {tr("Live readings, adaptive decisions and alerts across the seeded units.")}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            {tr("Open dashboard")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
