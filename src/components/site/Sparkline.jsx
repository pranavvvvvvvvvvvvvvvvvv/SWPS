import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Tiny self-drawing sparkline for one metric's recent history. */
export default function Sparkline({ points, stroke = "rgba(125,211,252,0.85)", className }) {
  const reduce = useReducedMotion();
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 26 - ((v - min) / span) * 20 - 3;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className={cn("h-6 w-full", className)}
    >
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}
