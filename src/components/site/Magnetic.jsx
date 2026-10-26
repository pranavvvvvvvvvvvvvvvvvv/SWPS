import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/** Wraps a button/link so it drifts slightly toward the cursor (desktop,
 *  motion allowed). The child keeps its own ripple / hover styles. */
export default function Magnetic({ children, className, strength = 0.28 }) {
  const reduce = useReducedMotion();
  const fine =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });

  if (reduce || !fine) return <div className={cn("inline-block", className)}>{children}</div>;

  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
