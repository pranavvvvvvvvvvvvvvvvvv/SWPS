import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Desktop-only: a soft water ripple ring wherever the user clicks on the
 *  public site (interactive controls are skipped — they have their own). */
export default function ClickRipples() {
  const reduce = useReducedMotion();
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onDown = (e) => {
      if (e.target?.closest?.("a, button, input, textarea, select, label, [role='button']")) return;
      const ripple = { id: `${Date.now()}-${Math.random()}`, x: e.clientX, y: e.clientY };
      setRipples((rs) => [...rs.slice(-3), ripple]);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [reduce]);

  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full border-2 border-primary/50"
          style={{ left: r.x, top: r.y, x: "-50%", y: "-50%" }}
          initial={{ width: 12, height: 12, opacity: 0.7 }}
          animate={{ width: 130, height: 130, opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
        />
      ))}
    </div>
  );
}
