import { Award, BookOpen, Cpu, GraduationCap, HeartHandshake, MapPin, Server, TestTube2, UserRound } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const ROLES = [
  { icon: Cpu, role: "Firmware & sensing", detail: "ESP32 firmware, probe calibration, adaptive control logic." },
  { icon: TestTube2, role: "Hardware & plumbing", detail: "Filter train assembly, sensor chamber, valve and enclosure." },
  { icon: Server, role: "Cloud & dashboard", detail: "Data pipeline, dashboard, alerts and reporting." },
  { icon: BookOpen, role: "Field validation", detail: "Site selection, community testing and manual cross-checks." },
];

export default function Team() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("Team & acknowledgment")}
        title={tr("A small team, building for community water points.")}
        description={tr(
          "Hardware, embedded firmware, cloud monitoring and field testing — split across the team and tested with the communities the system is designed for."
        )}
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Developer card */}
          <div id="developer" className="card-surface relative overflow-hidden p-7 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative">
              <p className="eyebrow">{tr("Developed by")}</p>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-600 text-xl font-bold text-white shadow-sm">
                  P
                </span>
                <div>
                  <h2 className="text-[24px] font-bold leading-tight">Pranav</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {tr("Developer · full-stack & IoT integration")}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                {tr(
                  "Designed and developed the SWPS platform: the ESP32 control firmware, the cloud data model, the adaptive purification logic and the monitoring dashboard on this site."
                )}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  tr("Firmware"),
                  tr("React dashboard"),
                  tr("Data pipeline"),
                  tr("System design"),
                ].map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Guide */}
          <div className="card-surface p-7">
            <p className="eyebrow">{tr("Project guide")}</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                <GraduationCap className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-[18px] font-bold leading-tight">Dr. Amrita Saha</h3>
                <p className="mt-1 text-[12.5px] text-muted-foreground">{tr("Project guide")}</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
              {tr(
                "For technical direction on the purification stages, the control logic and the research write-up — and for keeping the project anchored to a real field problem."
              )}
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-[12px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {tr("Hyderabad, Telangana")}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <SectionHeading
          eyebrow={tr("Project team")}
          title={tr("Roles across the build.")}
          description={tr(
            "The work is split by discipline. Role cards below are ready for the remaining team members' names."
          )}
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.role} className="rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-[13.5px] font-bold">{tr(r.role)}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{tr(r.detail)}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-border/70 pt-3 text-[11px] text-muted-foreground/70">
                  <UserRound className="h-3 w-3" />
                  {tr("Team member")}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading eyebrow={tr("Acknowledgment")} title={tr("With thanks.")} />
            <div className="mt-6 space-y-4 text-[13.5px] leading-relaxed text-muted-foreground">
              <p>
                {tr(
                  "We thank Dr. Amrita Saha for guiding this project from problem definition through to the working prototype, and for pushing us to test every assumption against real field conditions."
                )}
              </p>
              <p>
                {tr(
                  "We are grateful to the village water committees and local operators who allowed us to install trial units, collect samples and compare sensor readings against handheld test kits. Their feedback shaped the alert thresholds and the maintenance workflow more than any specification did."
                )}
              </p>
              <p>
                {tr(
                  "Finally, we acknowledge the World Health Organization and the Bureau of Indian Standards, whose published drinking-water guidance forms the safe envelope used throughout this system."
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-7">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="mt-4 text-[17px] font-bold">{tr("About the project")}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {tr(
                "SWPS combines purification and continuous quality monitoring in one control loop, so the water is both treated and proven safe before it is released."
              )}
            </p>
            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-[12.5px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{tr("Project")}</dt>
                <dd className="text-right font-medium">
                  {tr("SWPS — Smart Water Purification & Quality Monitoring")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{tr("Year")}</dt>
                <dd className="font-medium">2026</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{tr("Guide")}</dt>
                <dd className="text-right font-medium">Dr. Amrita Saha</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{tr("Developer")}</dt>
                <dd className="font-medium">Pranav</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-card p-3.5 text-[11.5px] text-muted-foreground">
              <HeartHandshake className="h-3.5 w-3.5 shrink-0 text-primary" />
              {tr("Designed for community water points in rural and mining-affected areas.")}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
