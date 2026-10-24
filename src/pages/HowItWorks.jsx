import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowDown,
  BellRing,
  CheckCircle2,
  Cpu,
  Droplets,
  FlaskConical,
  Gauge,
  RefreshCw,
  ShieldCheck,
  Siren,
  Waves,
} from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { IMAGES } from "@/lib/media";
import { Image } from "@/components/ui/image";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Droplets,
    title: "Raw water enters the unit",
    text: "Water is drawn from a borewell, overhead tank or open source into the intake manifold. An ultrasonic level sensor in the raw tank reports how much water is available before a cycle starts.",
    detail: "Inputs: level sensor · intake solenoid",
  },
  {
    icon: FlaskConical,
    title: "Three-stage filtration",
    text: "A 5-micron sediment cartridge removes sand and grit, granular activated carbon adsorbs organics, chlorine and odour, and the RO membrane rejects dissolved salts and heavy ions.",
    detail: "Stage 1 → 2 → 3 · pressure 40–60 psi",
  },
  {
    icon: Cpu,
    title: "Sensor chamber measures the outflow",
    text: "Treated water passes through a sealed chamber where four probes sample it: TDS, turbidity, temperature and flow/level. The ESP32 reads all four every cycle.",
    detail: "Sampling interval: 30 s per cycle",
  },
  {
    icon: ShieldCheck,
    title: "Compared against safe limits",
    text: "Each reading is compared to a threshold set for that unit — WHO-aligned by default and adjustable per site. The comparison is made on the device, so it works even without connectivity.",
    detail: "TDS ≤ 500 ppm · turbidity ≤ 5 NTU",
  },
  {
    icon: CheckCircle2,
    title: "A safe / unsafe decision is taken",
    text: "If all four parameters sit inside the envelope, the batch is marked safe. If any single parameter fails, the batch is marked unsafe and the outlet valve is de-energised immediately.",
    detail: "Valve: energised = released · off = held",
  },
  {
    icon: RefreshCw,
    title: "Re-filter or alert",
    text: "Unsafe water is routed back through carbon and RO stages and the cycle counter increments. If two consecutive cycles fail, an alert is raised to the health officer and local operator.",
    detail: "Escalation after 2 failed cycles",
  },
  {
    icon: BellRing,
    title: "Release clean water and update the dashboard",
    text: "Passing water is released to the storage tank. The reading, decision and cycle count are pushed to the cloud, where the dashboard updates live and the filter-health score is recalculated.",
    detail: "Payload: 4 readings + decision + cycle",
  },
];

export default function HowItWorks() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("How it works")}
        title={tr("Seven steps between raw water and a reading you can trust.")}
        description={tr(
          "Every unit runs the same closed loop. The sensor chamber sits downstream of the filters, so what is measured is the water that would actually reach the tap."
        )}
      />

      {/* pipeline strip */}
      <div className="border-b border-border bg-card">
        <div className="container-page py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {[
              { label: "Raw", icon: Droplets },
              { label: "Sediment", icon: Waves },
              { label: "Carbon", icon: FlaskConical },
              { label: "RO", icon: RefreshCw },
              { label: "Sensors", icon: Cpu },
              { label: "Decision", icon: ShieldCheck },
              { label: "Release", icon: CheckCircle2 },
            ].map((s, i, arr) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[12px] font-medium">{tr(s.label)}</span>
                  </div>
                  {i < arr.length - 1 && <Chevron />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={tr("Step by step")}
              title={tr("The control loop, in order.")}
            />
            <ol className="mt-9 space-y-0">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < STEPS.length - 1 && (
                      <span className="absolute left-[19px] top-11 h-[calc(100%-2.5rem)] w-px bg-border" />
                    )}
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[15px] font-bold leading-snug">{tr(step.title)}</h3>
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                        {tr(step.text)}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-primary/80">{step.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-border">
              <Image
                src={IMAGES.chamber}
                alt="Sensor chamber with TDS, turbidity and temperature probes"
                className="aspect-[4/3] w-full"
              />
            </div>
            <div className="card-surface p-5">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                <h4 className="text-[13px] font-bold">{tr("Decision rule on the device")}</h4>
              </div>
              <div className="mt-3 space-y-2 rounded-xl bg-secondary/60 p-4 font-mono text-[11.5px] leading-relaxed text-foreground/80">
                <p>
                  <span className="text-primary">if</span> tds &gt; max_tds <span className="text-muted-foreground">or</span>
                </p>
                <p>&nbsp;&nbsp;&nbsp;turbidity &gt; max_ntu <span className="text-muted-foreground">or</span></p>
                <p>&nbsp;&nbsp;&nbsp;temp &lt; min_t <span className="text-muted-foreground">or</span> temp &gt; max_t</p>
                <p>
                  <span className="text-primary">then</span> {tr("hold valve, re-filter")}
                </p>
                <p>
                  <span className="text-primary">else</span> {tr("release water, log safe")}
                </p>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {tr(
                  "The rule runs in firmware. Cloud connectivity changes how fast the world finds out — never whether the valve closes."
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-500/25 dark:bg-amber-500/10">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Siren className="h-4 w-4" />
                <h4 className="text-[13px] font-bold">{tr("When it escalates")}</h4>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-amber-800/80 dark:text-amber-200/80">
                {tr(
                  "Two failed re-filtration cycles in a row marks the filter as exhausted, raises a critical alert and adds the unit to the top of the maintenance priority list."
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-secondary/30">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <SectionHeading
            eyebrow={tr("Next")}
            title={tr("See how the pieces are wired together.")}
            description={tr(
              "Filter unit, sensor chamber, ESP32, cloud and dashboard — one architecture diagram."
            )}
          />
          <Link
            to="/architecture"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            {tr("System architecture")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}

function Chevron() {
  return <ArrowRight className="h-3.5 w-3.5 shrink-0 text-border" />;
}
