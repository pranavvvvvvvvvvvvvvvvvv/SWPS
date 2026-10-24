import { useState } from "react";
import { Camera, Expand, Play, Ruler, X } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/media";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { cn } from "@/lib/utils";

const SPECS = [
  { k: "Filtration stages", v: "Sediment (5 µm) → GAC carbon → RO" },
  { k: "Treated capacity", v: "≈ 60 L/h (prototype)" },
  { k: "Measured parameters", v: "TDS, turbidity, temperature, level" },
  { k: "Controller", v: "ESP32-WROOM-32, 240 MHz" },
  { k: "Enclosure", v: "Steel frame with IP65 electronics box" },
  { k: "Power", v: "12 V DC, 2 A adapter" },
  { k: "Uplink", v: "Wi-Fi 2.4 GHz · HTTPS / MQTT" },
  { k: "Local buffer", v: "≈ 7 days of readings at 1/min" },
];

const SHOTS = [
  { src: IMAGES.unit, title: "Purification unit", caption: "Three-stage filter train on the field frame, with the sensor chamber on the outlet." },
  { src: IMAGES.chamber, title: "Sensor chamber", caption: "TDS, turbidity and DS18B20 probes in a sealed acrylic chamber." },
  { src: IMAGES.dashboard, title: "Monitoring surface", caption: "The dashboard on a laptop and phone: live cards, trends and alerts." },
];

export default function Gallery() {
  const tr = useAutoTranslate();
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <PageHero
        eyebrow={tr("Prototype & gallery")}
        title={tr("The working unit, as built.")}
        description={tr(
          "Photographs from the assembly and field-testing stage of the prototype, with the specifications it currently meets."
        )}
      />

      <Section>
        <div className="group relative overflow-hidden rounded-3xl border border-border">
          <Image
            src={IMAGES.unit}
            alt="SWPS purification prototype in a village courtyard"
            className="aspect-[16/9] w-full"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04222c]/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
              <Camera className="h-3 w-3" /> {tr("Prototype · v1")}
            </span>
            <h2 className="mt-3 max-w-lg text-[20px] font-bold leading-snug text-white sm:text-[24px]">
              {tr("Filter train, sensor chamber and controller on one serviceable frame.")}
            </h2>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {SHOTS.map((shot) => (
            <button
              key={shot.title}
              type="button"
              onClick={() => setLightbox(shot)}
              className="group relative overflow-hidden rounded-2xl border border-border text-left"
            >
              <Image src={shot.src} alt={shot.title} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04222c]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                <div>
                  <p className="text-[12.5px] font-semibold text-white">{tr(shot.title)}</p>
                  <p className="mt-0.5 line-clamp-1 text-[10.5px] text-white/60">{tr(shot.caption)}</p>
                </div>
                <Expand className="h-3.5 w-3.5 shrink-0 text-white/70" />
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-secondary/30">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow={tr("Demo video")}
              title={tr("From raw intake to a released batch.")}
              description={tr(
                "A short walkthrough of the working prototype: filtration, sensor sampling and the automatic hold-and-re-filter response."
              )}
            />
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-[#04222c]">
              <div className="flex aspect-video items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                    <Play className="h-5 w-5" />
                  </span>
                  <p className="max-w-xs px-6 text-[12.5px] leading-relaxed text-cyan-100/60">
                    {tr(
                      "Demo video is being prepared for the final review. Photographs above are from the current prototype build."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow={tr("Specifications")}
              title={tr("What the current build meets.")}
            />
            <dl className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
              {SPECS.map((s) => (
                <div key={s.k} className="flex items-start justify-between gap-4 border-b border-border/70 px-4 py-3 last:border-0">
                  <dt className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <Ruler className="h-3 w-3" />
                    {tr(s.k)}
                  </dt>
                  <dd className="text-right text-[12.5px] font-medium">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <figure className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} className="max-h-[75vh] w-full rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-[12.5px] text-white/70">{tr(lightbox.caption)}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
