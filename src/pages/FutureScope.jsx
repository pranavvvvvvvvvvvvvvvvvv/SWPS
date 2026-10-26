import { BatteryCharging, BrainCircuit, CheckCircle2, Coins, Cpu, Droplets, FlaskConical, LineChart, MapPinned, Network, Sun, Wrench } from "lucide-react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import InteractiveCard from "@/components/site/InteractiveCard";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const ADVANTAGES = [
  { icon: CheckCircle2, t: "Safety is enforced, not reported", d: "An unsafe reading physically stops the water. This is the core difference from a monitoring-only node." },
  { icon: Coins, t: "Low bill of materials", d: "Off-the-shelf ESP32, standard filter housings and commodity probes keep a unit affordable for a panchayat." },
  { icon: Wrench, t: "Field-serviceable", d: "Cartridges, probes and the controller are plug-in modules, so a trained local operator can service a unit." },
  { icon: BatteryCharging, t: "Tolerates poor connectivity", d: "Control runs on-device and readings queue locally, so a dropped link never becomes a safety gap." },
  { icon: MapPinned, t: "One view for many sites", d: "A district officer sees every unit at once and is told which one needs attention first." },
  { icon: LineChart, t: "Auditable history", d: "Every reading and decision is retained, giving a traceable record for health inspections." },
];

const FUTURE = [
  {
    icon: FlaskConical,
    t: "pH and heavy-metal sensing",
    d: "Adding a pH electrode and an ion-selective or electrochemical probe brings fluoride, arsenic and iron into the same control loop — the parameters that matter most in mining belts.",
    tag: "Sensor expansion",
  },
  {
    icon: Sun,
    t: "Solar power with battery backup",
    d: "A 30 W panel and charge controller make a unit independent of grid availability, which is the usual reason remote water points fail.",
    tag: "Energy",
  },
  {
    icon: BrainCircuit,
    t: "ML-based quality prediction",
    d: "A model trained on seasonal history can anticipate a turbidity spike after rainfall and pre-emptively start a filtration cycle instead of reacting to it.",
    tag: "Intelligence",
  },
  {
    icon: Network,
    t: "LoRa mesh for no-signal sites",
    d: "Where Wi-Fi or cellular coverage does not reach, units can relay readings through a low-power mesh to a single gateway.",
    tag: "Connectivity",
  },
  {
    icon: Droplets,
    t: "Household metering",
    d: "Per-household flow sensing would let a panchayat track consumption and detect leaks in the distribution line.",
    tag: "Distribution",
  },
  {
    icon: Cpu,
    t: "Edge analytics on the board",
    d: "Running trend detection on the ESP32 would let the device flag a degrading membrane before a reading actually fails.",
    tag: "Firmware",
  },
];

const ROADMAP = [
  { phase: "Now", title: "Working prototype", items: ["4-parameter sensing", "Adaptive valve control", "Cloud dashboard", "Simulator for evaluation"] },
  { phase: "Next", title: "Field hardening", items: ["IP-rated enclosure", "Solar power option", "pH sensor integration", "Operator training kit"] },
  { phase: "Later", title: "District deployment", items: ["Heavy-metal sensing", "Predictive maintenance model", "LoRa backhaul", "Public water-quality portal"] },
];

export default function FutureScope() {
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const roadRef = useRef(null);
  const { scrollYProgress: roadP } = useScroll({
    target: roadRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const lineScale = useTransform(roadP, [0, 1], [0.004, 1]);

  return (
    <>
      <PageHero
        eyebrow={tr("Advantages & future scope")}
        title={tr("Useful today, extendable by design.")}
        description={tr(
          "The prototype deliberately uses a modular sensor head and a generic controller, so adding a parameter is a firmware and calibration task rather than a redesign."
        )}
      />

      <Section>
        <SectionHeading
          eyebrow={tr("Advantages")}
          title={tr("Why this shape of system works in the field.")}
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a) => {
            const Icon = a.icon;
            return (
              <InteractiveCard key={a.t} className="card-surface p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3.5 text-[13.5px] font-bold">{tr(a.t)}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(a.d)}</p>
              </InteractiveCard>
            );
          })}
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <SectionHeading
          eyebrow={tr("Future scope")}
          title={tr("Six extensions on the roadmap.")}
          description={tr(
            "Each one is an independent addition — none requires rebuilding the control loop."
          )}
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE.map((f) => {
            const Icon = f.icon;
            return (
              <InteractiveCard key={f.t} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {tr(f.tag)}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[13.5px] font-bold leading-snug">{tr(f.t)}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(f.d)}</p>
              </InteractiveCard>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow={tr("Roadmap")} title={tr("Where the project goes next.")} />
        <div ref={roadRef} className="relative mt-9">
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute -top-2 left-0 right-0 h-0.5 origin-left rounded-full bg-gradient-to-r from-primary via-sky-400 to-primary"
              style={{ scaleX: lineScale }}
            />
          )}
          <div className="grid gap-4 md:grid-cols-3">
          {ROADMAP.map((r, i) => (
            <div key={r.phase} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="absolute right-5 top-5 font-mono text-[11px] text-muted-foreground/50">
                0{i + 1}
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{tr(r.phase)}</p>
              <h3 className="mt-2 text-[16px] font-bold">{tr(r.title)}</h3>
              <ul className="mt-4 space-y-2">
                {r.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[12.5px] text-muted-foreground">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                    {tr(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
      </Section>
    </>
  );
}
