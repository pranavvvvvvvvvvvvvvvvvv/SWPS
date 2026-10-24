import { Link } from "react-router-dom";
import { ArrowRight, Clock, LineChart, ShieldCheck } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import ForecastPreview from "@/components/site/ForecastPreview";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const METHOD = [
  {
    icon: Clock,
    title: "Three days of history",
    text: "The last 72 hours of samples for the selected unit are pulled from the cloud database — every TDS, turbidity, temperature and level reading the unit reported.",
  },
  {
    icon: LineChart,
    title: "A trend is fitted",
    text: "A line of best fit is drawn through those samples for each parameter, and its quality is reported, so a noisy week is never presented as a certainty.",
  },
  {
    icon: ShieldCheck,
    title: "Checked against real limits",
    text: "The trend is extended hour by hour and compared with the unit's own stored thresholds, which is what turns a slope into a crossing time.",
  },
];

export default function Prediction() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("Prediction")}
        title={tr("Every safe limit now has an early warning.")}
        description={tr(
          "The unit already knows what the water is doing right now. The prediction module reads that same sensor history and says what it will do next — and how many hours are left before a limit is crossed."
        )}
      />

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={tr("Live forecast")}
            title={tr("Projected from the readings on record.")}
            description={tr(
              "Pick a unit and a horizon. The dashed line is where the trend is heading; the solid line is what was actually measured."
            )}
          />
          <Link
            to="/dashboard/prediction"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-[13px] font-semibold transition hover:border-primary/40 hover:text-primary"
          >
            {tr("Full prediction workspace")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-9">
          <ForecastPreview />
        </div>
      </Section>

      <Section className="border-t border-border bg-secondary/30">
        <SectionHeading
          eyebrow={tr("How it predicts")}
          title={tr("Three steps, no black box.")}
          description={tr(
            "The forecast is derived only from data this system already records and thresholds the team already set."
          )}
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {METHOD.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="card-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-[14.5px] font-bold leading-snug">{tr(step.title)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tr(step.text)}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <SectionHeading
            eyebrow={tr("Ask anything")}
            title={tr("Not sure what a number means?")}
            description={tr(
              "The assistant in the corner answers questions about the system, the water limits and how to read these projections — in English, Telugu or Hindi."
            )}
          />
          <Link
            to="/dashboard/prediction"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            {tr("Open prediction")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
