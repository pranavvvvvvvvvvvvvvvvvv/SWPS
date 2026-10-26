import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const WAVE_D =
  "M0,32 C120,8 240,56 360,32 C480,8 600,56 720,32 C840,8 960,56 1080,32 C1200,8 1320,56 1440,32 L1440,61 L0,61 Z";

/** Curved animated wave divider. Place it at the top of a section and give
 *  it a text-* colour class matching the section ABOVE it, so the previous
 *  section appears to end in a moving wave. `flip` turns it upside down. */
export default function WaveDivider({ className, flip = false }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      style={{ lineHeight: 0 }}
      className={cn("pointer-events-none w-full overflow-hidden", flip && "rotate-180", className)}
    >
      <svg
        className="block h-[42px] w-full"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        {reduce ? (
          <path d={WAVE_D} />
        ) : (
          <motion.g
            animate={{ x: [0, 360] }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          >
            <path d={WAVE_D} />
            <path d={WAVE_D} transform="translate(-360,0)" />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
