import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { CheckCircle2, ShieldX } from "lucide-react";
import FlowCard from "@/components/site/FlowCard";
import { Stagger, StaggerItem } from "@/components/site/Reveal";
import { useAutoTranslate } from "@/lib/AutoTranslate";

// Percentage-space path over the 4 + 3 card grid: across row one, down the
// right edge, then back across row two.
const PATH_D =
  "M-2,16 C10,4 22,28 34,16 C46,4 58,28 70,16 C82,4 94,28 104,16 C105.5,28 105.5,42 104,54 C92,42 80,66 68,54 C56,42 44,66 32,54 C20,42 8,66 -2,54";

/** The "dirty to clean" scroll story: a droplet travels along a self-drawing
 *  line through the 7 flow steps, clearing from muddy brown to pure blue,
 *  lighting each card as it passes — with a safe/unsafe demo at the decide
 *  and re-filter steps. */
export default function CleanseStory({ steps }) {
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const pathRef = useRef(null);
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const dotX = useSpring(0, { stiffness: 100, damping: 22 });
  const dotY = useSpring(0, { stiffness: 100, damping: 22 });
  const left = useTransform(dotX, (v) => `${v}%`);
  const top = useTransform(dotY, (v) => `${v}%`);
  const fill = useTransform(
    progress,
    [0, 0.18, 0.36, 0.55],
    ["#7a5a30", "#9c7a44", "#5795b8", "#38bdf8"]
  );

  useMotionValueEvent(progress, "change", (v) => {
    const p = Math.min(1, Math.max(0, v));
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      const pt = path.getPointAtLength(p * len);
      dotX.set(pt.x);
      dotY.set(pt.y);
    }
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 1.05));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const stateOf = (i) => (i === active ? "active" : i < active ? "passed" : "idle");

  return (
    <div ref={ref} className="relative mt-10">
      {/* self-drawing line (desktop grid only) */}
      <svg
        aria-hidden
        className="absolute inset-0 z-0 hidden h-full w-full lg:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          ref={pathRef}
          d={PATH_D}
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="text-primary/25"
          style={reduce ? { pathLength: 1 } : { pathLength: progress }}
        />
      </svg>

      {/* travelling droplet */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-[5] hidden lg:block"
          style={{ left, top, x: "-50%", y: "-50%" }}
        >
          <motion.span
            className="block h-4 w-4 rounded-full shadow-[0_0_16px_rgba(56,189,248,0.75)]"
            style={{ backgroundColor: fill }}
          />
          <AnimatePresence>
            {active === 4 && (
              <motion.span
                key="safe"
                initial={{ opacity: 0, y: 4, scale: 0.8 }}
                animate={{ opacity: 1, y: -16, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-300/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300"
              >
                <CheckCircle2 className="h-3 w-3 animate-pulse" />
                {tr("Safe · valve opens")}
              </motion.span>
            )}
            {active === 5 && (
              <motion.span
                key="unsafe"
                initial={{ opacity: 0, y: 4 }}
                animate={{
                  opacity: 1,
                  y: -16,
                  x: [0, -3, 3, -2, 2, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, x: { duration: 0.5, repeat: 2 } }}
                className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border border-rose-300/40 bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300"
              >
                <ShieldX className="h-3 w-3" />
                {tr("Unsafe · valve held")}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <Stagger className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" step={0.1}>
        {steps.slice(0, 4).map((step, i) => (
          <StaggerItem key={step.title} className="h-full">
            <FlowCard step={step} index={i} state={stateOf(i)} />
          </StaggerItem>
        ))}
      </Stagger>
      <Stagger className="relative z-10 mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" step={0.1}>
        {steps.slice(4).map((step, i) => {
          const idx = i + 4;
          return (
            <StaggerItem key={step.title} className="h-full">
              <FlowCard step={step} index={idx} state={stateOf(idx)} />
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
