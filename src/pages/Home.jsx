import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  Cpu,
  Droplets,
  FlaskConical,
  Gauge,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Siren,
  Waves,
  Wind,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import StatusPill from "@/components/StatusPill";
import { useI18n } from "@/lib/LanguageContext";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { readingStatus, formatReading } from "@/lib/water";
import { cn } from "@/lib/utils";

const SAMPLE = { tds: 268, turbidity: 1.8, temperature: 26.4, level: 72 };

const HERO_METRICS = [
  { key: "tds", label: "TDS", value: SAMPLE.tds, unit: "ppm", icon: Droplets, limit: "≤ 500 ppm" },
  { key: "turbidity", label: "Turbidity", value: SAMPLE.turbidity, unit: "NTU", icon: Waves, limit: "≤ 5 NTU" },
  { key: "temperature", label: "Temperature", value: SAMPLE.temperature, unit: "°C", icon: Gauge, limit: "10–30 °C" },
  { key: "level", label: "Water level", value: SAMPLE.level, unit: "%", icon: Wind, limit: "≥ 20 %" },
];

const FLOW = [
  { title: "Raw water in", text: "Borewell, tank or open source feeds the unit.", icon: Droplets },
  { title: "Three-stage filtration", text: "Sediment → activated carbon → RO membrane.", icon: FlaskConical },
  { title: "Sensor chamber", text: "TDS, turbidity, DS18B20 and level sensors read the outflow.", icon: Cpu },
  { title: "Compare with limits", text: "ESP32 checks every reading against WHO-based thresholds.", icon: ShieldCheck },
  { title: "Decide", text: "Safe passes through. Unsafe holds the valve shut.", icon: CheckCircle2 },
  { title: "Re-filter or alert", text: "A cycle restarts, or operators are alerted instantly.", icon: Siren },
  { title: "Release and report", text: "Clean water flows, and the dashboard updates live.", icon: BellRing },
];

const LIMITS = [
  { parameter: "TDS", who: "≤ 500 mg/L", sensor: "Analog TDS probe", note: "Dissolved salts, mining runoff" },
  { parameter: "Turbidity", who: "≤ 5 NTU", sensor: "Optical turbidity sensor", note: "Suspended sediment" },
  { parameter: "Temperature", who: "10–30 °C", sensor: "DS18B20 (1-Wire)", note: "Process + comfort band" },
  { parameter: "Water level", who: "≥ 20 %", sensor: "Ultrasonic level sensor", note: "Prevents dry-run" },
  { parameter: "pH", who: "6.5–8.5", sensor: "Planned (future scope)", note: "Roadmap sensor" },
];

const FEATURES = [
  {
    icon: RefreshCw,
    title: "Adaptive purification control",
    text: "The ESP32 does not just report — it acts. Every reading is compared to the safe envelope; an out-of-range value closes the release valve and restarts a filtration cycle until the water passes.",
    tag: "Closed loop",
  },
  {
    icon: Siren,
    title: "Remote alerts",
    text: "Severity-graded alerts reach the health officer and local operator the moment a limit is crossed, with the exact reading, the threshold and the automatic response taken.",
    tag: "Email · SMS · push hooks",
  },
  {
    icon: MapPin,
    title: "Multi-point cloud dashboard",
    text: "Every unit across every village reports to one dashboard: live readings, filter health, maintenance priority and a colour-coded map of the whole network.",
    tag: "Multi-site network",
  },
];

export default function Home() {
  const { t } = useI18n();
  const tr = useAutoTranslate();

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden water-hero text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
          <div className="absolute inset-0 water-grid" />
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl animate-drift" />

        <div className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-cyan-100/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t("home.eyebrow")}
            </span>

            <h1 className="mt-6 text-[38px] font-bold leading-[1.03] tracking-[-0.02em] sm:text-[54px] lg:text-[58px]">
              {t("home.title.a")}{" "}
              <span className="display-accent font-normal text-cyan-200">{t("home.title.b")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cyan-50/75 sm:text-base">
              {t("home.sub")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04222c] shadow-lg shadow-black/20 transition hover:bg-cyan-50"
              >
                {t("common.openDashboard")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                {t("common.explore")}
              </Link>
            </div>

            <dl className="mt-10 flex max-w-lg items-center gap-8 border-t border-white/10 pt-6">
              {[{ k: "24/7", v: "continuous sampling" }].map((s) => (
                <div key={s.v}>
                  <dt className="font-mono text-xl font-medium text-white">{s.k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/60">{tr(s.v)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* live-looking sample card */}
          <div className="fade-up delayed-2">
            <div className="glass-panel rounded-3xl p-5 shadow-2xl shadow-black/30 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/60">
                    {t("home.sample")}
                  </p>
                  <p className="mt-1 font-heading text-sm font-semibold">
                    Unit SW-02 · Kothagudem
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  {tr("Online")}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {HERO_METRICS.map((m) => {
                  const status = readingStatus(m.key, m.value);
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.key}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-100/70">
                          <Icon className="h-3.5 w-3.5" />
                          {tr(m.label)}
                        </span>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            status === "safe" && "bg-emerald-400",
                            status === "warn" && "bg-amber-400",
                            status === "danger" && "bg-rose-400"
                          )}
                        />
                      </div>
                      <p className="mt-2 font-mono text-[22px] leading-none text-white">
                        {formatReading(m.value)}
                        <span className="ml-1 text-[11px] font-normal text-cyan-100/50">{m.unit}</span>
                      </p>
                      <p className="mt-1.5 text-[10px] text-cyan-100/40">{m.limit}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#03181f]/60 px-3.5 py-3">
                <div className="flex items-center gap-2 text-[11px] text-cyan-100/70">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-300" />
                  {tr("Adaptive cycle complete · 0 re-filters today")}
                </div>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-cyan-100/35">
                {tr(
                  "Illustrative values from a seeded demo unit — the dashboard shows live records."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEM ---------------- */}
      <Section id="problem" className="border-b border-border">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow={t("home.problem.eyebrow")}
            title={t("home.problem.title")}
            description={t("home.problem.sub")}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                stat: "≈ 2 in 5",
                label: "rural households rely on sources with no routine quality check",
                note: "Monitoring gap",
              },
              {
                stat: "100%",
                label: "of a unit's history is only useful if someone can see it",
                note: "Visibility gap",
              },
              {
                stat: "0",
                label: "decisions taken automatically by conventional filter units",
                note: "Action gap",
              },
            ].map((c) => (
              <div key={c.note} className="card-surface p-5">
                <p className="font-heading text-[28px] font-bold leading-none text-primary">{c.stat}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{tr(c.label)}</p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                  {tr(c.note)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------- FLOW ---------------- */}
      <Section className="bg-secondary/30">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={t("home.how.eyebrow")}
            title={t("home.how.title")}
            description={tr(
              "One closed control loop — from raw intake to a verified, released batch of drinking water."
            )}
          />
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
          >
            {tr("Full walkthrough")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.slice(0, 4).map((step, i) => (
            <FlowCard key={step.title} step={step} index={i} />
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW.slice(4).map((step, i) => (
            <FlowCard key={step.title} step={step} index={i + 4} />
          ))}
        </div>
      </Section>

      {/* ---------------- LIMITS + CONTROL ---------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading
              eyebrow={tr("Thresholds")}
              title={t("home.limits.title")}
              description={tr(
                "Defaults follow WHO drinking-water guidance. Every unit can be tuned individually from the dashboard."
              )}
            />
            <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{tr("Parameter")}</th>
                    <th className="px-4 py-3 font-semibold">{tr("Safe limit")}</th>
                    <th className="hidden px-4 py-3 font-semibold sm:table-cell">{tr("Sensor")}</th>
                  </tr>
                </thead>
                <tbody>
                  {LIMITS.map((row) => (
                    <tr key={row.parameter} className="border-t border-border/70">
                      <td className="px-4 py-3 font-medium">{tr(row.parameter)}</td>
                      <td className="px-4 py-3 font-mono text-[12px] text-primary">{row.who}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {tr(row.sensor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-surface relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-2xl" />
            <p className="eyebrow">{tr("Adaptive purification control")}</p>
            <h3 className="mt-3 text-[22px] font-bold leading-snug">
              {tr("When a reading fails, the valve closes before anyone has to react.")}
            </h3>
            <ol className="mt-6 space-y-4">
              {[
                { t: "Reading exceeds limit", d: "e.g. turbidity 7.4 NTU against a 5 NTU threshold.", icon: Siren, tone: "danger" },
                { t: "Release valve held closed", d: "The outlet solenoid is de-energised immediately.", icon: ShieldCheck, tone: "warn" },
                { t: "Re-filtration cycle runs", d: "Carbon + RO stages restart; cycle counter increments.", icon: RefreshCw, tone: "warn" },
                { t: "Re-test and release", d: "Outflow is sampled again. Passing water is released and logged.", icon: CheckCircle2, tone: "safe" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <li key={s.t} className="flex gap-3.5">
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                        s.tone === "danger" && "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400",
                        s.tone === "warn" && "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400",
                        s.tone === "safe" && "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold">
                        <span className="mr-1.5 font-mono text-[11px] text-muted-foreground">
                          0{i + 1}
                        </span>
                        {tr(s.t)}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(s.d)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <Link
              to="/features"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {tr("See all features")} <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ---------------- FEATURES ---------------- */}
      <Section className="border-y border-border bg-secondary/30">
        <SectionHeading
          align="center"
          eyebrow={tr("What makes SWPS different")}
          title={tr("Three capabilities, working together.")}
          description={tr(
            "Each one is useful alone. Together they close the loop between cleaning water and proving it."
          )}
        />
        <div className="mt-11 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group card-surface p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold">{tr(f.title)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tr(f.text)}</p>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/70">
                  {tr(f.tag)}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---------------- CTA ---------------- */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl water-hero px-6 py-12 text-white sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 water-grid" />
          </div>
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">
                {tr("Monitoring dashboard")}
              </p>
              <h2 className="mt-3 text-[26px] font-bold leading-tight sm:text-[34px]">
                {t("home.cta.title")}
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-cyan-50/70">{t("home.cta.sub")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04222c] transition hover:bg-cyan-50"
              >
                {t("common.viewDashboard")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/research"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
              >
                {tr("Read the paper")}
              </Link>
            </div>
          </div>
          <div className="relative mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-cyan-100/50">
            <span className="flex items-center gap-1.5">
              <StatusPill status="safe" label={tr("Clean")} />
              {tr("release permitted")}
            </span>
            <span className="flex items-center gap-1.5">
              <StatusPill status="warn" label={tr("Watch")} />
              {tr("re-test scheduled")}
            </span>
            <span className="flex items-center gap-1.5">
              <StatusPill status="danger" label={tr("Unsafe")} />
              {tr("valve held closed")}
            </span>
          </div>
        </div>
      </Section>
    </>
  );
}

function FlowCard({ step, index }) {
  const tr = useAutoTranslate();
  const Icon = step.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30">
      <div className="flex items-start justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-[13.5px] font-semibold leading-snug">{tr(step.title)}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(step.text)}</p>
      <span className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500 group-hover:w-full" />
    </div>
  );
}
