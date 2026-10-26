import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { CheckCircle2, Droplets, Gauge, RefreshCw, Waves } from "lucide-react";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { useI18n } from "@/lib/LanguageContext";
import { readingStatus } from "@/lib/water";
import { cn } from "@/lib/utils";
import CountUp from "@/components/site/CountUp";
import Sparkline from "@/components/site/Sparkline";
import LevelGauge from "@/components/site/LevelGauge";

const EASE = [0.22, 1, 0.36, 1];

const BASE = { tds: 268, turbidity: 1.8, temperature: 26.4, level: 72 };

const METRICS = [
  { key: "tds", label: "TDS", unit: "ppm", icon: Droplets, limit: "≤ 500 ppm", decimals: 0 },
  { key: "turbidity", label: "Turbidity", unit: "NTU", icon: Waves, limit: "≤ 5 NTU", decimals: 1 },
  { key: "temperature", label: "Temperature", unit: "°C", icon: Gauge, limit: "10–30 °C", decimals: 1 },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round1 = (v) => Math.round(v * 10) / 10;

/** The hero's live-looking sample card. Values count up on load, then get a
 *  gentle nudge every 4 s (illustrative demo values only); each metric keeps
 *  a self-drawing sparkline of its recent history and the water level sits in
 *  a circular gauge whose fill rises and waves. Floats slowly and tilts
 *  toward the cursor on desktop pointers. */
export default function HeroSampleCard() {
  const { t } = useI18n();
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const [values, setValues] = useState(BASE);
  const cardRef = useRef(null);
  const canTilt =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const rotateX = useSpring(0, { stiffness: 160, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 20 });

  // seed a short history per metric so sparklines have something to draw
  const history = useRef({
    tds: Array.from({ length: 10 }, (_, i) => 250 + Math.sin(i / 1.6) * 14 + Math.random() * 6),
    turbidity: Array.from({ length: 10 }, (_, i) => 1.6 + Math.cos(i / 2.1) * 0.35 + Math.random() * 0.15),
    temperature: Array.from({ length: 10 }, (_, i) => 26 + Math.sin(i / 2.4) * 0.7 + Math.random() * 0.2),
  });
  const [series, setSeries] = useState(history.current);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setValues((v) => {
        const next = {
          tds: clamp(Math.round(v.tds + (Math.random() * 6 - 3)), 246, 292),
          turbidity: round1(clamp(v.turbidity + (Math.random() * 0.4 - 0.2), 1.2, 2.4)),
          temperature: round1(clamp(v.temperature + (Math.random() * 0.6 - 0.3), 25.4, 27.6)),
          level: Math.round(clamp(v.level + (Math.random() * 4 - 2), 66, 78)),
        };
        history.current = {
          tds: [...history.current.tds.slice(-11), next.tds],
          turbidity: [...history.current.turbidity.slice(-11), next.turbidity],
          temperature: [...history.current.temperature.slice(-11), next.temperature],
        };
        setSeries(history.current);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [reduce]);

  const handleMouseMove = (e) => {
    if (reduce || !canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 5);
    rotateX.set(-py * 5);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
          className="glass-panel rounded-3xl p-5 shadow-2xl shadow-black/30 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-sky-100/60">{t("home.sample")}</p>
              <p className="mt-1 font-heading text-sm font-semibold">Unit SW-02 · Kothagudem</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <span className="pulse-ring relative h-1.5 w-1.5 rounded-full bg-emerald-300 text-emerald-300" />
              {tr("Online")}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {METRICS.map((m) => {
              const status = readingStatus(m.key, values[m.key]);
              const Icon = m.icon;
              return (
                <div key={m.key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-sky-100/70">
                      <Icon className="h-3.5 w-3.5" />
                      {tr(m.label)}
                    </span>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        status === "safe" && "bg-emerald-400",
                        status === "warn" && "bg-amber-400",
                        status === "danger" && "bg-rose-400"
                      )}
                    />
                  </div>
                  <p className="mt-2 font-mono text-[22px] leading-none text-white">
                    <CountUp value={values[m.key]} decimals={m.decimals} />
                    <span className="ml-1 text-[11px] font-normal text-sky-100/50">{m.unit}</span>
                  </p>
                  <Sparkline points={series[m.key]} className="mt-1.5" />
                  <p className="mt-1 text-[10px] text-sky-100/40">{m.limit}</p>
                </div>
              );
            })}

            <LevelGauge level={values.level} />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-[#031a30]/60 px-3.5 py-3">
            <div className="flex items-center gap-2 text-[11px] text-sky-100/70">
              <RefreshCw className="h-3.5 w-3.5 text-emerald-300" />
              {tr("Adaptive cycle complete · 0 re-filters today")}
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-sky-100/35">
            {tr("Illustrative values from a seeded demo unit — the dashboard shows live records.")}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
