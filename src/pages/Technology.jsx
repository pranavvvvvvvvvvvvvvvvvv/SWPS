import { Cpu, Droplet, Gauge, Radio, Server, Smartphone, Thermometer, Waves, Wifi } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import InteractiveCard from "@/components/site/InteractiveCard";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const HARDWARE = [
  {
    icon: Cpu,
    name: "ESP32-WROOM-32",
    role: "Controller & uplink",
    specs: ["Dual-core 240 MHz", "Wi-Fi 802.11 b/g/n + BLE", "3.3 V logic · 12-bit ADC"],
    note: "Runs the adaptive control rule locally and pushes readings over HTTPS.",
  },
  {
    icon: Droplet,
    name: "TDS sensor (analog)",
    role: "Dissolved solids",
    specs: ["0–1000 ppm range", "±2 % F.S.", "Analog 0–2.3 V output"],
    note: "Compensated against water temperature before the threshold comparison.",
  },
  {
    icon: Waves,
    name: "Turbidity sensor",
    role: "Suspended sediment",
    specs: ["0–3000 NTU range", "Optical (90° scatter)", "5 V supply"],
    note: "Detects the sediment slugs that follow rainfall and mining discharge.",
  },
  {
    icon: Thermometer,
    name: "DS18B20",
    role: "Water temperature",
    specs: ["−55 to +125 °C", "±0.5 °C accuracy", "1-Wire, waterproof probe"],
    note: "Used both for the temperature limit and to correct TDS readings.",
  },
  {
    icon: Gauge,
    name: "Ultrasonic level sensor",
    role: "Tank level",
    specs: ["2–400 cm range", "±3 mm", "HC-SR04 compatible"],
    note: "Prevents dry-running the pump and reports how much clean water is stored.",
  },
  {
    icon: Radio,
    name: "Solenoid valve + relay",
    role: "Physical actuation",
    specs: ["12 V DC, normally closed", "5 V relay module", "Manual override"],
    note: "Normally closed means a power failure holds water back, not releases it.",
  },
];

const SOFTWARE = [
  {
    icon: Server,
    name: "Node.js REST API",
    role: "Ingestion & queries",
    items: ["POST /readings from devices", "GET /readings with time ranges", "Threshold + alert services"],
  },
  {
    icon: WaveIcon,
    name: "WebSocket channel",
    role: "Live updates",
    items: ["Push on new reading", "Push on alert state change", "Per-device subscriptions"],
  },
  {
    icon: Server,
    name: "MongoDB / Firebase",
    role: "Storage",
    items: ["Time-series reading documents", "Device, threshold, alert collections", "Indexed by device + timestamp"],
  },
  {
    icon: Smartphone,
    name: "React + Tailwind",
    role: "Dashboard",
    items: ["Recharts for trends", "Leaflet for unit map", "PWA offline cache"],
  },
];

const PINS = [
  { gpio: "GPIO 34", signal: "TDS analog", notes: "ADC1 channel, input only" },
  { gpio: "GPIO 35", signal: "Turbidity analog", notes: "ADC1 channel, input only" },
  { gpio: "GPIO 4", signal: "DS18B20 data", notes: "4.7 kΩ pull-up to 3V3" },
  { gpio: "GPIO 5", signal: "Ultrasonic trigger", notes: "HC-SR04" },
  { gpio: "GPIO 18", signal: "Ultrasonic echo", notes: "Level divider to 3.3 V" },
  { gpio: "GPIO 26", signal: "Relay — release valve", notes: "Active HIGH" },
  { gpio: "GPIO 27", signal: "Relay — pump", notes: "Active HIGH" },
];

export default function Technology() {
  const tr = useAutoTranslate();

  return (
    <>
      <PageHero
        eyebrow={tr("Technology")}
        title={tr("Off-the-shelf parts, chosen to be replaceable in the field.")}
        description={tr(
          "Nothing in the unit needs a specialised lab to service. Each sensor is a plug-in module and the controller is a single ESP32 board."
        )}
      />

      <Section>
        <SectionHeading
          eyebrow={tr("Hardware")}
          title={tr("Sensing and actuation.")}
          description={tr("Four measured parameters, one actuator, one controller.")}
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HARDWARE.map((h) => {
            const Icon = h.icon;
            return (
              <InteractiveCard key={h.name} className="card-surface p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="icon-pulse h-4 w-4" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {tr(h.role)}
                  </span>
                </div>
                <h3 className="mt-3.5 text-[14px] font-bold">{h.name}</h3>
                <ul className="mt-3 space-y-1.5">
                  {h.specs.map((s) => (
                    <li key={s} className="font-mono text-[11px] text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-border/70 pt-3 text-[12px] leading-relaxed text-muted-foreground">
                  {tr(h.note)}
                </p>
              </InteractiveCard>
            );
          })}
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow={tr("Wiring reference")}
            title={tr("Pin assignment.")}
            description={tr(
              "Reference mapping used by the prototype firmware. ADC1 pins are used because ADC2 is unavailable while Wi-Fi is active."
            )}
          />
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">GPIO</th>
                  <th className="px-4 py-3 font-semibold">{tr("Signal")}</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">{tr("Notes")}</th>
                </tr>
              </thead>
              <tbody>
                {PINS.map((p) => (
                  <tr key={p.gpio} className="border-t border-border/70">
                    <td className="px-5 py-3 font-mono text-[12px] text-primary">{p.gpio}</td>
                    <td className="px-4 py-3 font-medium">{p.signal}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{tr(p.notes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={tr("Software")}
          title={tr("From the board to the dashboard.")}
          description={tr("A small stack with one job per layer.")}
        />
        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          {SOFTWARE.map((s) => {
            const Icon = s.icon;
            return (
              <InteractiveCard key={s.name} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="icon-pulse h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-[13.5px] font-bold leading-tight">{s.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{tr(s.role)}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {s.items.map((i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] text-muted-foreground">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                      {tr(i)}
                    </li>
                  ))}
                </ul>
              </InteractiveCard>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Wifi, t: "Transport", d: "HTTPS JSON uplink with MQTT as the low-bandwidth alternative." },
            { icon: Server, t: "Auth", d: "JWT sessions with role-scoped access to every endpoint." },
            { icon: Smartphone, t: "Offline", d: "Service worker caches the shell and the last readings per unit." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.t} className="rounded-2xl border border-border bg-secondary/40 p-5">
                <Icon className="h-4 w-4 text-primary" />
                <h4 className="mt-2.5 text-[13px] font-semibold">{tr(c.t)}</h4>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{tr(c.d)}</p>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function WaveIcon(props) {
  return <Waves {...props} />;
}
