import { ArrowRight, ArrowDown, Cloud, Cpu, Droplets, Filter, Gauge, MonitorSmartphone, Radio, ShieldCheck, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const LAYERS = [
  {
    label: "1 · Water path",
    tone: "from-cyan-500/10 to-teal-500/5",
    items: [
      { name: "Raw intake", sub: "tank / borewell", icon: Droplets },
      { name: "Sediment filter", sub: "5 µm", icon: Filter },
      { name: "Carbon block", sub: "GAC", icon: Waves },
      { name: "RO membrane", sub: "0.0001 µm", icon: ShieldCheck },
      { name: "Sensor chamber", sub: "4 probes", icon: Gauge },
      { name: "Solenoid valve", sub: "release / hold", icon: Radio },
    ],
  },
  {
    label: "2 · Electronics",
    tone: "from-primary/10 to-primary/0",
    items: [
      { name: "ESP32-WROOM", sub: "Wi-Fi + BLE MCU", icon: Cpu },
      { name: "ADS1115 ADC", sub: "16-bit sampling", icon: Gauge },
      { name: "Relay module", sub: "valve + pump", icon: Radio },
      { name: "Local buffer", sub: "SD / flash queue", icon: Cloud },
    ],
  },
  {
    label: "3 · Cloud",
    tone: "from-sky-500/10 to-blue-500/5",
    items: [
      { name: "REST ingestion", sub: "POST /readings", icon: Cloud },
      { name: "Time-series store", sub: "readings + decisions", icon: Filter },
      { name: "WebSocket push", sub: "live dashboard", icon: Radio },
      { name: "Alert engine", sub: "thresholds + escalation", icon: ShieldCheck },
    ],
  },
  {
    label: "4 · Clients",
    tone: "from-indigo-500/10 to-indigo-500/0",
    items: [
      { name: "Web dashboard", sub: "this app", icon: MonitorSmartphone },
      { name: "Mobile app", sub: "Flutter / React Native", icon: MonitorSmartphone },
      { name: "SMS / email", sub: "operator alerts", icon: Radio },
    ],
  },
];

const BLOCKS = [
  {
    block: "Purification unit",
    role: "Removes sediment, organics and dissolved solids in three stages.",
    interface: "Water in/out · ¼\" push-fit",
  },
  {
    block: "Sensor chamber",
    role: "Sealed inline chamber holding TDS, turbidity and DS18B20 probes.",
    interface: "Analog + 1-Wire to ESP32",
  },
  {
    block: "ESP32 controller",
    role: "Samples sensors, applies adaptive logic, drives valve and uplinks data.",
    interface: "Wi-Fi 2.4 GHz · HTTPS / MQTT",
  },
  {
    block: "Cloud service",
    role: "Stores readings and decisions, evaluates alerts, serves the dashboard API.",
    interface: "REST + WebSocket",
  },
  {
    block: "Dashboard & mobile app",
    role: "Live monitoring, alerts, maintenance ranking and reports for each role.",
    interface: "Browser · iOS / Android",
  },
];

export default function Architecture() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("System architecture")}
        title={tr("Four layers from the filter housing to the phone in an officer's hand.")}
        description={tr(
          "The unit is autonomous at the bottom and observable at the top. Losing the network never stops a valve from closing; it only delays the report."
        )}
      />

      <Section>
        <div className="space-y-3">
          {LAYERS.map((layer, li) => (
            <div key={layer.label}>
              <div className={`rounded-2xl border border-border bg-gradient-to-br ${layer.tone} p-5`}>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {tr(layer.label)}
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {layer.items.length} {tr("blocks")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                  {layer.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.name}
                        className="rounded-xl border border-border bg-card px-3 py-3 shadow-sm"
                      >
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        <p className="mt-2 text-[12px] font-semibold leading-tight">{tr(item.name)}</p>
                        <p className="mt-0.5 text-[10.5px] text-muted-foreground">{tr(item.sub)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {li < LAYERS.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-4 w-4 text-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow={tr("Interfaces")}
            title={tr("What each block is responsible for.")}
            description={tr(
              "A block only talks to its neighbour above and below it, which keeps field replacement simple."
            )}
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">{tr("Block")}</th>
                  <th className="px-4 py-3 font-semibold">{tr("Responsibility")}</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">{tr("Interface")}</th>
                </tr>
              </thead>
              <tbody>
                {BLOCKS.map((b) => (
                  <tr key={b.block} className="border-t border-border/70 align-top">
                    <td className="px-5 py-3.5 font-medium">{tr(b.block)}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">{tr(b.role)}</td>
                    <td className="hidden px-4 py-3.5 font-mono text-[11px] text-primary/80 md:table-cell">
                      {b.interface}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Store-and-forward uplink",
              d: "If Wi-Fi drops, readings queue on the device with timestamps and sync in order once the link returns. No gaps in the record.",
            },
            {
              t: "Server-side thresholds",
              d: "Limits live in the database, so a health officer can tune a unit remotely. The device keeps a cached copy of the last known limits.",
            },
            {
              t: "Role-scoped API",
              d: "Admin, health officer, local operator and public viewer each receive only the endpoints and actions their role allows.",
            },
          ].map((c) => (
            <div key={c.t} className="card-surface p-6">
              <h3 className="text-[14px] font-bold">{tr(c.t)}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tr(c.d)}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-[#04222c] p-6 text-cyan-50/80">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/60">{tr("Uplink payload")}</p>
          <pre className="mt-3 overflow-x-auto font-mono text-[11.5px] leading-relaxed">
{`POST /api/readings
{
  "deviceId":  "SW-02",
  "tds":       286,
  "turbidity": 1.8,
  "temp":      26.4,
  "level":     72,
  "timestamp": "2026-10-23T11:42:00+05:30",
  "decision":  "safe",
  "cycle":     0
}`}
          </pre>
        </div>

        <Link
          to="/technology"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
        >
          {tr("Sensors, boards and stack")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Section>
    </>
  );
}
