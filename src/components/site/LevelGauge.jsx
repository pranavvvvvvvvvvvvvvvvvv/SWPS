import { motion, useReducedMotion } from "framer-motion";
import CountUp from "@/components/site/CountUp";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const EASE = [0.22, 1, 0.36, 1];
// One wave period = 20 units; 240-wide path = 12 periods, loops seamlessly.
const WAVE_D =
  "M0,8 Q10,0 20,8 T40,8 T60,8 T80,8 T100,8 T120,8 T140,8 T160,8 T180,8 T200,8 T220,8 T240,8 L240,140 L0,140 Z";

/** Circular gauge for water level: the blue fill rises with the value and its
 *  surface keeps waving gently. */
export default function LevelGauge({ level = 72 }) {
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const surfaceY = 104 - (Math.min(100, Math.max(0, level)) / 100) * 88;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
      <div className="flex items-center justify-between text-[11px] font-medium text-sky-100/70">
        <span>{tr("Water level")}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      <div className="relative mx-auto mt-2 h-[92px] w-[92px]">
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
          <defs>
            <clipPath id="lvl-clip">
              <circle cx="60" cy="60" r="44" />
            </clipPath>
          </defs>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <g clipPath="url(#lvl-clip)">
            <motion.g
              initial={reduce ? false : { y: 104 }}
              animate={{ y: surfaceY }}
              transition={{ duration: 1.3, ease: EASE }}
            >
              <motion.path
                d={WAVE_D}
                fill="rgba(56,189,248,0.45)"
                initial={false}
                animate={reduce ? undefined : { x: [0, -80] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
              />
              <g transform="translate(40,3)">
                <motion.path
                  d={WAVE_D}
                  fill="rgba(56,189,248,0.3)"
                  initial={false}
                  animate={reduce ? undefined : { x: [0, -80] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
                />
              </g>
            </motion.g>
          </g>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[19px] font-medium leading-none text-white drop-shadow">
            <CountUp value={level} />
            <span className="text-[11px] text-sky-100/60">%</span>
          </p>
        </div>
      </div>
      <p className="mt-1 text-center text-[10px] text-sky-100/40">≥ 20 %</p>
    </div>
  );
}
