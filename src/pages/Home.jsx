import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  Cpu,
  Droplets,
  FlaskConical,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import Reveal, { Stagger, StaggerItem } from "@/components/site/Reveal";
import WaterSurface from "@/components/site/WaterSurface";
import WaveDivider from "@/components/site/WaveDivider";
import RippleLink from "@/components/site/RippleLink";
import Magnetic from "@/components/site/Magnetic";
import InteractiveCard from "@/components/site/InteractiveCard";
import CleanseStory from "@/components/site/CleanseStory";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import HeroSampleCard from "@/components/site/HeroSampleCard";
import CountUp from "@/components/site/CountUp";
import StatusPill from "@/components/StatusPill";
import { useI18n } from "@/lib/LanguageContext";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const heroWord = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

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

const PROBLEM_STATS = [
  {
    stat: "≈ 2 in 5",
    label: "rural households rely on sources with no routine quality check",
    note: "Monitoring gap",
  },
  {
    stat: <CountUp value={100} suffix="%" />,
    label: "of a unit's history is only useful if someone can see it",
    note: "Visibility gap",
  },
  {
    stat: "0",
    label: "decisions taken automatically by conventional filter units",
    note: "Action gap",
  },
];

export default function Home() {
  const { t } = useI18n();
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);

  // hero parallax — layers drift at different speeds as the page scrolls
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(heroP, [0, 1], [0, 140]);
  const blobY = useTransform(heroP, [0, 1], [0, 240]);
  const blobY2 = useTransform(heroP, [0, 1], [0, 170]);
  const contentY = useTransform(heroP, [0, 1], [0, 56]);
  const cardY = useTransform(heroP, [0, 1], [0, 96]);

  const wordsA = t("home.title.a").split(" ");
  const wordsB = t("home.title.b").split(" ");

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative overflow-hidden water-hero text-white">
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bgY }}>
          <WaterSurface />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
          <div className="absolute inset-0 water-grid" />
        </div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"
          style={reduce ? undefined : { y: blobY }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl"
          style={reduce ? undefined : { y: blobY2 }}
        />

        <motion.div
          className="container-page relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24"
          style={reduce ? undefined : { y: contentY }}
        >
          <motion.div initial={reduce ? "visible" : "hidden"} animate="visible" variants={heroContainer}>
            <motion.span
              variants={heroItem}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-wide text-sky-100/90"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t("home.eyebrow")}
            </motion.span>

            <h1 className="mt-6 text-[38px] font-bold leading-[1.03] tracking-[-0.02em] sm:text-[54px] lg:text-[58px]">
              {wordsA.map((w, i) => (
                <motion.span key={`a-${i}`} variants={heroWord} className="inline-block">
                  {w}
                  {i < wordsA.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
              {wordsB.map((w, i) => (
                <motion.span
                  key={`b-${i}`}
                  variants={heroWord}
                  className="display-accent shimmer-text inline-block"
                >
                  {w}
                  {i < wordsB.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={heroItem}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-sky-50/75 sm:text-base"
            >
              {t("home.sub")}
            </motion.p>

            <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <RippleLink
                  to="/dashboard"
                  rippleClass="bg-[#04213a]/25"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04213a] shadow-lg shadow-black/20 transition hover:bg-sky-50"
                >
                  {t("common.openDashboard")}
                  <ArrowRight className="h-4 w-4" />
                </RippleLink>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50 hover:bg-white/5"
                >
                  {t("common.explore")}
                </Link>
              </Magnetic>
            </motion.div>

            <motion.dl
              variants={heroItem}
              className="mt-10 flex max-w-lg items-center gap-8 border-t border-white/10 pt-6"
            >
              {[{ k: "24/7", v: "continuous sampling" }].map((s) => (
                <div key={s.v}>
                  <dt className="font-mono text-xl font-medium text-white">{s.k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-sky-100/60">{tr(s.v)}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div style={reduce ? undefined : { y: cardY }}>
            <HeroSampleCard />
          </motion.div>
        </motion.div>

        <WaveDivider className="absolute inset-x-0 bottom-0 text-background" />
      </section>

      {/* ---------------- PROBLEM ---------------- */}
      <Section id="problem">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow={t("home.problem.eyebrow")}
              title={t("home.problem.title")}
              description={t("home.problem.sub")}
            />
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-3">
            {PROBLEM_STATS.map((c) => (
              <StaggerItem key={c.note} className="h-full">
                <InteractiveCard className="card-surface h-full p-5">
                  <p className="font-heading text-[28px] font-bold leading-none text-primary">{c.stat}</p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{tr(c.label)}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                    {tr(c.note)}
                  </p>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1} className="mt-10">
          <BeforeAfterSlider />
        </Reveal>
      </Section>

      {/* ---------------- FLOW (dirty-to-clean scroll story) ---------------- */}
      <Section className="bg-secondary" waveTop="text-background">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("home.how.eyebrow")}
              title={t("home.how.title")}
              description={tr(
                "One closed control loop — from raw intake to a verified, released batch of drinking water."
              )}
            />
          </Reveal>
          <Reveal delay={0.15} y={12}>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
            >
              {tr("Full walkthrough")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <CleanseStory steps={FLOW} />
      </Section>

      {/* ---------------- LIMITS + CONTROL ---------------- */}
      <Section waveTop="text-secondary">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow={tr("Thresholds")}
                title={t("home.limits.title")}
                description={tr(
                  "Defaults follow WHO drinking-water guidance. Every unit can be tuned individually from the dashboard."
                )}
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-7">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
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
                      <tr
                        key={row.parameter}
                        className="border-t border-border/70 transition-colors hover:bg-secondary/50"
                      >
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
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <InteractiveCard lift={false} className="card-surface relative h-full overflow-hidden p-6 sm:p-8">
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
            </InteractiveCard>
          </Reveal>
        </div>
      </Section>

      {/* ---------------- FEATURES ---------------- */}
      <Section className="bg-secondary" waveTop="text-background">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={tr("What makes SWPS different")}
            title={tr("Three capabilities, working together.")}
            description={tr(
              "Each one is useful alone. Together they close the loop between cleaning water and proving it."
            )}
          />
        </Reveal>
        <Stagger className="mt-11 grid gap-4 md:grid-cols-3" step={0.12}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={f.title} className="h-full">
                <InteractiveCard className="group card-surface h-full p-6">
                  <span className="icon-bob flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold">{tr(f.title)}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tr(f.text)}</p>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/70">
                    {tr(f.tag)}
                  </p>
                </InteractiveCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* ---------------- CTA ---------------- */}
      <Section waveTop="text-secondary">
        <div className="relative overflow-hidden rounded-3xl water-hero px-6 py-12 text-white sm:px-12 sm:py-14">
          <WaterSurface />
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute inset-0 water-grid" />
          </div>
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <Reveal className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-200/70">
                {tr("Monitoring dashboard")}
              </p>
              <h2 className="mt-3 text-[26px] font-bold leading-tight sm:text-[34px]">
                {t("home.cta.title")}
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-sky-50/70">{t("home.cta.sub")}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <RippleLink
                    to="/dashboard"
                    rippleClass="bg-[#04213a]/25"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04213a] transition hover:bg-sky-50"
                  >
                    {t("common.viewDashboard")} <ArrowRight className="h-4 w-4" />
                  </RippleLink>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Link
                    to="/research"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
                  >
                    {tr("Read the paper")}
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
          <div className="relative mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.16em] text-sky-100/50">
            <span className="flex items-center gap-1.5">
              <StatusPill status="safe" label={tr("Clean")} pulse />
              {tr("release permitted")}
            </span>
            <span className="flex items-center gap-1.5">
              <StatusPill status="warn" label={tr("Watch")} pulse />
              {tr("re-test scheduled")}
            </span>
            <span className="flex items-center gap-1.5">
              <StatusPill status="danger" label={tr("Unsafe")} pulse />
              {tr("valve held closed")}
            </span>
          </div>
        </div>
      </Section>
    </>
  );
}
