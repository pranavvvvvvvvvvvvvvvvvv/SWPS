import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const EASE = [0.22, 1, 0.36, 1];
const lerp = (a, b, t) => a + (b - a) * t;

const PARTICLES = [
{ left: 22, top: 34, size: 5, dur: 5.5 },
{ left: 55, top: 46, size: 3, dur: 7 },
{ left: 70, top: 30, size: 4, dur: 6 },
{ left: 35, top: 58, size: 3, dur: 8 },
{ left: 60, top: 64, size: 5, dur: 5 },
{ left: 45, top: 24, size: 2.5, dur: 7.5 },
{ left: 78, top: 52, size: 3, dur: 6.5 },
{ left: 28, top: 70, size: 4, dur: 8.5 }];


const SPARKLES = [
{ left: 30, top: 36, dur: 3.2 },
{ left: 58, top: 28, dur: 2.6 },
{ left: 72, top: 52, dur: 3.8 },
{ left: 40, top: 62, dur: 3 },
{ left: 62, top: 68, dur: 2.9 }];


function Glass({ before, reduce }) {
  return (
    <div className="relative h-[220px] w-[130px] sm:h-[250px] sm:w-[150px]">
      <div className="absolute inset-x-0 top-0 h-5 rounded-t-lg border border-white/40 bg-white/25" />
      <div className="absolute inset-x-0 top-2.5 bottom-0 overflow-hidden rounded-b-[2.6rem] border-x border-b border-white/40 bg-white/10">
        <motion.div
          className={cn(
            "absolute inset-x-0 bottom-0 h-[78%]",
            before ?
            "bg-gradient-to-t from-[#5d4120] via-[#8a6a3f] to-[#a3824c]" :
            "bg-gradient-to-t from-sky-600 via-sky-400 to-sky-300"
          )}
          initial={false}
          animate={{ height: "78%" }} />
        
        {before ?
        PARTICLES.map((p, i) =>
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#3f2c12]/80"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={reduce ? undefined : { y: [0, -8, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut" }} />

        ) :
        SPARKLES.map((s, i) =>
        <motion.span
          key={i}
          className="absolute text-white"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={reduce ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut" }}>
          
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
                  <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" />
                </svg>
              </motion.span>
        )}
      </div>
    </div>);

}

/** Before/after drag slider: contaminated water on the left, clean water on
 *  the right, with the TDS / turbidity numbers interpolating as you drag. */
export default function BeforeAfterSlider({ className }) {
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const [pos, setPos] = useState(30);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // One gentle demo sweep when it first scrolls into view.
  useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(12, 46, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setPos(Math.round(v))
    });
    return () => controls.stop();
  }, [inView, reduce]);

  const t = pos / 100;
  const tds = Math.round(lerp(1480, 180, t));
  const ntu = lerp(46, 0.9, t).toFixed(1);

  return (
    <div
      ref={ref}
      className={cn("relative select-none overflow-hidden rounded-3xl border border-border bg-card", className)}>
      
      












































      
    </div>);

}
