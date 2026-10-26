import { useState } from "react";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import { Download, FileText, Loader2, Quote } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import EmailLink from "@/components/site/EmailLink";

const ABSTRACT = `Access to safe drinking water remains uneven in rural and mining-affected regions, where source quality varies with rainfall, recharge and industrial runoff. Existing interventions typically address purification and quality monitoring as separate systems: purifiers remove contaminants but produce no record of effectiveness, while IoT monitoring nodes report readings without acting on them. This project presents SWPS, a smart water purification and quality monitoring system that closes the loop between measurement and action. Raw water passes through sediment, granular activated carbon and reverse-osmosis stages into a sealed sensor chamber where total dissolved solids, turbidity, temperature and water level are measured by an ESP32 microcontroller. Each reading is compared against a per-device safe envelope derived from WHO drinking-water guidance. When a parameter exceeds its limit, the controller de-energises a normally-closed outlet valve, restarts the filtration cycle and escalates an alert to a health officer or local operator after repeated failures. Readings, decisions and cycle counts are synchronised to a cloud service and surfaced in a role-based dashboard with live status cards, trend charts, adaptive-control logs, a multi-site map, maintenance priority ranking and report exports. The prototype demonstrates that a low-cost, field-serviceable unit can enforce water safety autonomously while retaining an auditable record for health authorities.`;

const KEYWORDS = ["Water quality monitoring", "Adaptive purification control", "ESP32", "IoT", "TDS", "Turbidity", "Rural water safety"];

const RELATED = [
  {
    work: "Conventional community RO plant",
    focus: "Purification only",
    gap: "No sensing, no record; filter exhaustion is invisible.",
    ours: "Purification + continuous sensing + enforced release",
  },
  {
    work: "IoT water-quality node (Wi-Fi)",
    focus: "Monitoring only",
    gap: "Publishes readings; water keeps flowing regardless.",
    ours: "Reading drives the valve in the same control loop",
  },
  {
    work: "Handheld test-kit survey",
    focus: "Periodic manual sampling",
    gap: "Point-in-time, labour intensive, no trend.",
    ours: "Continuous sampling; manual kit supported for cross-checks",
  },
  {
    work: "Municipal SCADA plant",
    focus: "Large centralised treatment",
    gap: "High cost, requires grid and skilled operators.",
    ours: "Low-cost, field-serviceable, offline-tolerant deployment",
  },
  {
    work: "Smart home purifier with app",
    focus: "Single household, cartridge alerts",
    gap: "No community-scale view, no multi-site comparison.",
    ours: "Multi-village dashboard and maintenance ranking",
  },
];

const REFERENCES = [
  "World Health Organization, Guidelines for Drinking-water Quality, 4th edition incorporating the first and second addenda, Geneva: WHO, 2022.",
  "Bureau of Indian Standards, IS 10500:2012 — Drinking Water Specification, New Delhi: BIS, 2012.",
  "Espressif Systems, ESP32 Series Datasheet, version 4.x, 2022.",
  "Analog Devices, DS18B20 Programmable Resolution 1-Wire Digital Thermometer, datasheet, 2019.",
  "Ministry of Jal Shakti, Department of Drinking Water and Sanitation, Jal Jeevan Mission — guidelines and water quality monitoring framework, Government of India.",
];

const METHOD = [
  ["Bench calibration", "Each probe is calibrated against a reference meter across its operating range before field deployment."],
  ["Cycle repeatability", "Ten consecutive filtration cycles are run on the same source to measure reading variance."],
  ["Cross-check with test kit", "Handheld kit results are logged beside sensor values at every site visit to quantify sensor drift."],
  ["Operational metrics", "Alert latency, valve response time and offline-buffer integrity are recorded during the field trial."],
];

export default function Research() {
  const tr = useAutoTranslate();
  const [building, setBuilding] = useState(false);

  const downloadPaper = () => {
    setBuilding(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      const width = 595 - margin * 2;
      let y = 64;

      const write = (text, { size = 11, style = "normal", gap = 14, color = "#1a2b31" } = {}) => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, width);
        lines.forEach((line) => {
          if (y > 780) {
            doc.addPage();
            y = 64;
          }
          doc.text(line, margin, y);
          y += size + 5;
        });
        y += gap;
      };

      write("Smart Water Purification and Quality Monitoring System (SWPS)", { size: 17, style: "bold", gap: 10 });
      write("Adaptive purification control for rural and mining-affected water sources", { size: 11.5, style: "italic", gap: 6, color: "#3c5a63" });
      write("Pranav — Developer, SWPS", { size: 10, gap: 2 });
      write("chpranav559@gmail.com", { size: 10, gap: 2, color: "#3c5a63" });
      write("Project guide: Dr. Amrita Saha", { size: 10, gap: 16 });
      write("Abstract", { size: 13, style: "bold", gap: 8 });
      write(ABSTRACT, { size: 10.5, gap: 14 });
      write("Keywords", { size: 13, style: "bold", gap: 8 });
      write(KEYWORDS.join(", "), { size: 10.5, gap: 14 });
      write("I. Introduction", { size: 13, style: "bold", gap: 8 });
      write(
        "Rural habitations and mining-affected belts face water quality that changes faster than inspection cycles. Treated water may be sampled monthly at best, while turbidity and dissolved solids can shift within hours of rainfall or upstream discharge. A system that measures but does not act leaves the interval between a failing reading and a human response unprotected.",
        { size: 10.5, gap: 14 }
      );
      write("II. System Description", { size: 13, style: "bold", gap: 8 });
      write(
        "The unit comprises a three-stage filter train (5 µm sediment, granular activated carbon, reverse osmosis), a sealed sensor chamber carrying TDS, turbidity and DS18B20 probes plus an ultrasonic level sensor, and an ESP32 controller driving a normally-closed outlet solenoid through a relay. The controller evaluates each reading against a per-device safe envelope, holds the valve on failure, restarts the filtration cycle and escalates after two consecutive failures. Readings and decisions are synchronised to a cloud service and displayed in a role-based dashboard.",
        { size: 10.5, gap: 14 }
      );
      write("III. Related Work", { size: 13, style: "bold", gap: 8 });
      RELATED.forEach((r, i) => {
        write(`${i + 1}. ${r.work} — limitation: ${r.gap}`, { size: 10, gap: 4 });
        write(`   SWPS difference: ${r.ours}`, { size: 10, gap: 8, color: "#3c5a63" });
      });
      y += 6;
      write("IV. Evaluation Approach", { size: 13, style: "bold", gap: 8 });
      write(
        "Evaluation combines bench calibration of each probe against reference instruments, a repeatability study across ten filtration cycles, and a field comparison between sensor readings and handheld test-kit measurements at each site. Alert latency, valve response time and offline-buffer integrity are recorded as operational metrics. Results from the current prototype phase are reported in the project report rather than in this summary, so that no unverified figures are published.",
        { size: 10.5, gap: 14 }
      );
      write("V. Conclusion", { size: 13, style: "bold", gap: 8 });
      write(
        "SWPS demonstrates that a low-cost, field-serviceable purification unit can enforce drinking-water safety autonomously while producing an auditable record. Treating monitoring as an input to actuation, rather than as a separate reporting layer, is the design decision that makes the system dependable in low-connectivity settings.",
        { size: 10.5, gap: 14 }
      );
      write("References", { size: 13, style: "bold", gap: 8 });
      REFERENCES.forEach((ref, i) => write(`[${i + 1}] ${ref}`, { size: 9.5, gap: 6, color: "#3c5a63" }));

      doc.save("SWPS-paper.pdf");
    } finally {
      setBuilding(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow={tr("Research")}
        title={tr("The paper behind the prototype.")}
        description={tr(
          "A concise write-up of the problem, the control-loop design and how the system is evaluated. Downloadable as a PDF for review."
        )}
      >
        <button
          type="button"
          onClick={downloadPaper}
          disabled={building}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {tr("Download paper (PDF)")}
        </button>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {tr("Abstract")}
              </p>
            </div>
            <p className="mt-4 text-[14.5px] leading-[1.75] text-foreground/85">{tr(ABSTRACT)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {KEYWORDS.map((k) => (
                <span key={k} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {tr(k)}
                </span>
              ))}
            </div>
          </div>

          <aside className="card-surface h-fit p-6">
            <Quote className="h-5 w-5 text-primary/40" />
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {tr("“A reading that cannot stop the tap is only a report, not a safeguard.”")}
            </p>
            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tr("Author")}</dt>
                <dd className="font-medium">Pranav</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tr("Guide")}</dt>
                <dd className="text-right font-medium">Dr. Amrita Saha</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tr("Project")}</dt>
                <dd className="text-right font-medium">{tr("SWPS — smart water monitoring")}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tr("Year")}</dt>
                <dd className="font-medium">2026</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{tr("Contact")}</dt>
                <dd className="text-right">
                  <EmailLink className="text-[11.5px]" />
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <SectionHeading
          eyebrow={tr("Related work")}
          title={tr("How SWPS compares.")}
          description={tr(
            "Each row is a real class of solution, and the specific limitation that motivated this project."
          )}
        />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[720px] text-left text-[12.5px]">
            <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">{tr("Approach")}</th>
                <th className="px-4 py-3 font-semibold">{tr("Focus")}</th>
                <th className="px-4 py-3 font-semibold">{tr("Limitation")}</th>
                <th className="px-4 py-3 font-semibold text-primary">SWPS</th>
              </tr>
            </thead>
            <tbody>
              {RELATED.map((r) => (
                <tr key={r.work} className="border-t border-border/70 align-top">
                  <td className="px-4 py-3.5 font-medium">{tr(r.work)}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{tr(r.focus)}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{tr(r.gap)}</td>
                  <td className="bg-primary/[0.035] px-4 py-3.5">{tr(r.ours)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeading eyebrow={tr("Method")} title={tr("How the system is evaluated.")} />
            <ol className="mt-6 space-y-4">
              {METHOD.map(([t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold">{tr(t)}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{tr(d)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeading eyebrow={tr("References")} title={tr("Sources cited.")} />
            <ol className="mt-6 space-y-3">
              {REFERENCES.map((ref, i) => (
                <motion.li
                  key={ref}
                  className="flex gap-3 text-[12.5px] leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="font-mono text-[11px] text-primary">[{i + 1}]</span>
                  {ref}
                </motion.li>
              ))}
            </ol>
            <p className="mt-5 rounded-xl border border-border bg-secondary/50 p-4 text-[11.5px] leading-relaxed text-muted-foreground">
              {tr(
                "The downloadable PDF summarises the abstract, design and evaluation approach. Measured results are reported only once bench and field trials are complete."
              )}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
