import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const wavePath = (ox) =>
  `M${ox},46 C${ox + 84},18 ${ox + 168},74 ${ox + 252},46 C${ox + 336},18 ${ox + 420},74 ${ox + 504},46 C${ox + 588},18 ${ox + 672},74 ${ox + 756},46 C${ox + 840},18 ${ox + 924},74 ${ox + 1008},46 C${ox + 1092},18 ${ox + 1176},74 ${ox + 1260},46 L${ox + 1260},150 L${ox},150 Z`;

const WAVES = [
  { duration: 46, fill: "#7dd3fc", opacity: 0.1 },
  { duration: 32, fill: "#7dd3fc", opacity: 0.16 },
  { duration: 21, fill: "#bae6fd", opacity: 0.22 },
];

/** Decorative water layer: drifting SVG waves, rising bubbles and a soft
 *  caustics shimmer. Absolutely positioned inside an overflow-hidden parent. */
export default function WaterBackground({ className }) {
  const reduce = useReducedMotion();

  const bubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 4 + Math.random() * 92,
        size: 5 + Math.random() * 11,
        duration: 11 + Math.random() * 10,
        delay: Math.random() * 12,
        drift: (Math.random() - 0.5) * 70,
      })),
    []
  );

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {reduce ? (
        <div className="absolute inset-x-0 bottom-0 h-[42%]">
          <svg className="h-full w-full" viewBox="0 0 1260 150" preserveAspectRatio="none">
            <path d={wavePath(0)} fill="#7dd3fc" opacity="0.14" />
          </svg>
        </div>
      ) : (
        <>
          {/* caustics shimmer */}
          <motion.div
            className="absolute -top-1/4 left-0 h-[80%] w-[60%] blur-2xl"
            style={{ background: "radial-gradient(45% 45% at 50% 50%, rgba(56,189,248,0.15), transparent 70%)" }}
            animate={{ x: ["-40%", "150%"] }}
            transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 left-0 h-[60%] w-[45%] blur-2xl"
            style={{ background: "radial-gradient(40% 40% at 50% 50%, rgba(125,211,252,0.1), transparent 70%)" }}
            animate={{ x: ["-60%", "190%"] }}
            transition={{ duration: 44, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />

          {/* rising bubbles */}
          {bubbles.map((b) => (
            <motion.span
              key={b.id}
              className="absolute rounded-full border border-white/20 bg-white/[0.06]"
              style={{ left: `${b.left}%`, bottom: -30, width: b.size, height: b.size }}
              animate={{
                y: ["0vh", "-30vh", "-60vh", "-90vh", "-118vh"],
                x: [0, b.drift / 2, b.drift, b.drift / 2, 0],
                opacity: [0, 0.55, 0.5, 0.35, 0],
              }}
              transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* layered drifting waves */}
          {WAVES.map((w, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 left-0 h-[42%] w-[200%]"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: w.duration, repeat: Infinity, ease: "linear" }}
            >
              <svg className="h-full w-full" viewBox="0 0 2520 150" preserveAspectRatio="none" style={{ opacity: w.opacity }}>
                <path d={`${wavePath(0)} ${wavePath(1260)}`} fill={w.fill} />
              </svg>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}
