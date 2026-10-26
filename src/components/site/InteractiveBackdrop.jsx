import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePointer } from "@/hooks/usePointer";
import { cn } from "@/lib/utils";

const WAVE_PATH =
  "M0 30 Q150 8 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30 L2400 60 L0 60 Z";

function makeBubbles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 3 + Math.random() * 93,
    size: 10 + Math.random() * 26,
    duration: 15 + Math.random() * 17,
    delay: -Math.random() * 22,
    opacity: 0.3 + Math.random() * 0.35,
  }));
}

/** Fixed, click-through water backdrop mounted once per layout (portaled to
 *  body so it sits behind the page content). Cursor-tracking glow, parallax
 *  bubbles, a drifting caustic grid and slow waves at the bottom; on touch it
 *  follows the finger, and when idle it drifts on its own. `variant="subtle"`
 *  keeps it faint for the dashboard. Static under prefers-reduced-motion. */
export default function InteractiveBackdrop({ variant = "default" }) {
  const reduce = useReducedMotion();
  const pointer = usePointer();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastMove = useRef(0);
  const subtle = variant === "subtle";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.42);
  const sx = useSpring(px, { stiffness: 40, damping: 18 });
  const sy = useSpring(py, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (!pointer.ready) return;
    px.set(pointer.nx);
    py.set(pointer.ny);
    lastMove.current = Date.now();
  }, [pointer.ready, pointer.nx, pointer.ny, px, py]);

  // slow automatic drift when the pointer is idle (and on touch devices)
  useAnimationFrame((t) => {
    if (reduce || Date.now() - lastMove.current < 4500) return;
    px.set(0.5 + Math.sin(t / 5600) * 0.24);
    py.set(0.42 + Math.cos(t / 6800) * 0.16);
  });

  const glowLeft = useTransform(sx, (v) => `${v * 100}%`);
  const glowTop = useTransform(sy, (v) => `${v * 100}%`);
  const gridX = useTransform(sx, (v) => (v - 0.5) * -26);
  const gridY = useTransform(sy, (v) => (v - 0.5) * -18);
  const nearX = useTransform(sx, (v) => (v - 0.5) * -34);
  const nearY = useTransform(sy, (v) => (v - 0.5) * -20);
  const farX = useTransform(sx, (v) => (v - 0.5) * 22);
  const farY = useTransform(sy, (v) => (v - 0.5) * 14);

  const bubbles = useMemo(() => {
    if (typeof window === "undefined") return [];
    const small = window.innerWidth < 640;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    let n = subtle ? 5 : small ? 6 : 11;
    if (lowPower) n = Math.max(4, n - 3);
    return makeBubbles(n);
  }, [subtle]);

  if (reduce || !mounted) {
    return mounted
      ? createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]"
          />,
          document.body
        )
      : null;
  }

  return createPortal(
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        subtle ? "opacity-60" : "opacity-100",
        hidden && "backdrop-paused"
      )}
    >
      {/* soft glow following the cursor */}
      <motion.div
        className={cn("absolute h-[32rem] w-[32rem] rounded-full blur-3xl", subtle ? "opacity-40" : "opacity-100")}
        style={{
          left: glowLeft,
          top: glowTop,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(closest-side, hsl(var(--primary) / 0.13), transparent 72%)",
        }}
      />
      {/* caustic grid shifting with the cursor */}
      <motion.div
        className="water-grid absolute -inset-[60px] opacity-50"
        style={{ x: gridX, y: gridY }}
      />
      {/* bubbles: near layer moves against the cursor, far layer with it */}
      <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
        {bubbles.map((b) => (
          <span
            key={`n${b.id}`}
            className="bubble"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.opacity,
            }}
          />
        ))}
      </motion.div>
      <motion.div className="absolute inset-0" style={{ x: farX, y: farY }}>
        {bubbles.slice(0, Math.ceil(bubbles.length / 2)).map((b) => (
          <span
            key={`f${b.id}`}
            className="bubble"
            style={{
              left: `${(b.left + 37) % 95}%`,
              width: b.size * 0.6,
              height: b.size * 0.6,
              animationDuration: `${b.duration + 9}s`,
              animationDelay: `${b.delay}s`,
              opacity: b.opacity * 0.6,
            }}
          />
        ))}
      </motion.div>
      {/* slow waves at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 overflow-hidden">
        <svg
          className="wave-drift-slow absolute bottom-0 left-0 h-full w-[2400px] min-w-full text-primary/[0.05]"
          viewBox="0 0 2400 60"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d={WAVE_PATH} />
        </svg>
        <svg
          className="wave-drift absolute bottom-0 left-0 h-full w-[2400px] min-w-full text-sky-400/[0.07]"
          viewBox="0 0 2400 60"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d={WAVE_PATH} />
        </svg>
      </div>
    </div>,
    document.body
  );
}
