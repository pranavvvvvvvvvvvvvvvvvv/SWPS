import { Link } from "react-router-dom";
import { ArrowRight, Check, X, Droplets, Activity, Wrench, EyeOff } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const GAPS = [
  {
    icon: Droplets,
    title: "Purifiers that never report",
    text: "Household and community RO units clean water but hold no memory of it. Filter exhaustion, membrane damage and bypass go unnoticed until taste or illness appears.",
  },
  {
    icon: Activity,
    title: "Monitors that never act",
    text: "IoT water-quality nodes publish readings to a dashboard, but the water keeps flowing regardless. Detection and intervention stay in different systems — and different hands.",
  },
  {
    icon: Wrench,
    title: "Maintenance by guesswork",
    text: "Without per-unit history, filter replacement is scheduled by calendar rather than condition. Some units are serviced too late, others far too often.",
  },
  {
    icon: EyeOff,
    title: "No proof for the community",
    text: "A village cannot see what its water contains. Trust in a shared water point depends on visible, continuous evidence — not an annual lab certificate.",
  },
];

const COMPARISON = [
  {
    capability: "Removes sediment, organics and dissolved solids",
    conventional: "partial",
    monitor: "no",
    swps: "yes",
  },
  { capability: "Measures quality continuously", conventional: "no", monitor: "yes", swps: "yes" },
  { capability: "Decides safe / unsafe automatically", conventional: "no", monitor: "no", swps: "yes" },
  { capability: "Physically holds back unsafe water", conventional: "no", monitor: "no", swps: "yes" },
  { capability: "Re-filters until the reading passes", conventional: "manual", monitor: "no", swps: "yes" },
  { capability: "Alerts operators in real time", conventional: "no", monitor: "yes", swps: "yes" },
  { capability: "Multi-site comparison and priority ranking", conventional: "no", monitor: "partial", swps: "yes" },
  { capability: "Works offline in low-bandwidth areas", conventional: "yes", monitor: "no", swps: "yes" },
];

const PRINCIPLES = [
  {
    t: "Treat purification and monitoring as one control loop",
    d: "The sensor output is an input to the valve, not just a number on a screen.",
  },
  {
    t: "Assume the network is unreliable",
    d: "Each unit buffers readings locally and syncs when connectivity returns, so a dropped link never becomes a safety gap.",
  },
  {
    t: "Keep the hardware serviceable in the field",
    d: "Standard filter housings, plug-in probes and a single ESP32 board — replaceable by a local operator without a lab.",
  },
  {
    t: "Make the evidence visible",
    d: "Every reading, decision and re-filter cycle is stored and mapped, so health officers can audit a unit's whole history.",
  },
];

export default function About() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("About the project")}
        title={tr(
          "Purification and monitoring are usually sold as two products. Safety needs them as one."
        )}
        description={tr(
          "SWPS was built for rural habitations and mining-affected belts, where raw water can carry high dissolved solids and suspended sediment — and where nobody is on site to test it every day."
        )}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow={tr("The problem")}
            title={tr("Unsafe water is rarely obvious.")}
            description={tr(
              "Mining runoff, deep-borewell salinity and monsoon turbidity change a source's quality without changing how it looks. A family drawing from a shared tap has no way to tell whether today's water is the same as last week's."
            )}
          />
          <div className="space-y-5 text-[14.5px] leading-relaxed text-muted-foreground">
            <p>
              {tr(
                "Community water points in these regions face three compounding issues. First, the raw source itself is variable: total dissolved solids can swing from acceptable to more than twice the WHO guideline after a single recharge event. Second, the purification hardware that exists is passive — it treats water but produces no record of whether treatment actually worked. Third, the people responsible for the unit are usually not on site, and have no way to know a filter has reached the end of its life."
              )}
            </p>
            <p>
              {tr(
                "Conventional responses treat each issue separately: install a purifier, add a testing camp, train an operator. Each works in isolation, and none of them closes the loop between a measurement and a physical action. When a reading crosses a limit at 2 a.m., the water still flows."
              )}
            </p>
            <div className="rounded-2xl border-l-2 border-primary bg-secondary/50 p-5">
              <p className="text-[13.5px] font-medium text-foreground">
                {tr(
                  "SWPS starts from the opposite assumption: a reading that cannot stop the tap is only a report, not a safeguard."
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <SectionHeading
          eyebrow={tr("Where existing solutions fall short")}
          title={tr("Four gaps, one root cause.")}
          description={tr(
            "Each of these is a real, separately solvable weakness — but they share the same origin: quality data never becomes an action."
          )}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {GAPS.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="card-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold">{tr(g.title)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tr(g.text)}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={tr("How SWPS differs")}
          title={tr("A side-by-side look.")}
          description={tr("Compared with a conventional purifier and with a standalone quality monitor.")}
        />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-semibold">{tr("Capability")}</th>
                <th className="px-4 py-3.5 font-semibold">{tr("Conventional purifier")}</th>
                <th className="px-4 py-3.5 font-semibold">{tr("IoT monitor only")}</th>
                <th className="px-4 py-3.5 font-semibold text-primary">SWPS</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.capability} className="border-t border-border/70">
                  <td className="px-5 py-3.5 font-medium">{tr(row.capability)}</td>
                  <Cell value={row.conventional} />
                  <Cell value={row.monitor} />
                  <Cell value={row.swps} emphasis />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow={tr("Design principles")}
            title={tr("What guided every engineering choice.")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={p.t} className="rounded-2xl border border-border bg-card p-5">
                <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
                <h3 className="mt-2 text-[13.5px] font-semibold leading-snug">{tr(p.t)}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{tr(p.d)}</p>
              </div>
            ))}
          </div>
        </div>
        <Link
          to="/how-it-works"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          {tr("Walk through the seven control steps")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}

function Cell({ value, emphasis }) {
  const tr = useAutoTranslate();
  const map = {
    yes: { icon: Check, cls: "text-emerald-600 dark:text-emerald-400", label: "Yes" },
    no: { icon: X, cls: "text-muted-foreground/60", label: "No" },
    partial: { icon: Check, cls: "text-amber-600 dark:text-amber-400", label: "Partial" },
    manual: { icon: Check, cls: "text-amber-600 dark:text-amber-400", label: "Manual" },
  };
  const cfg = map[value] || map.no;
  const Icon = cfg.icon;
  return (
    <td className={emphasis ? "bg-primary/[0.035] px-4 py-3.5" : "px-4 py-3.5"}>
      <span className={`inline-flex items-center gap-1.5 text-[12.5px] ${cfg.cls}`}>
        <Icon className="h-3.5 w-3.5" />
        {tr(cfg.label)}
      </span>
    </td>
  );
}
