import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/** Animates a number from its current value to `value` when scrolled into
 *  view (the first time), and re-animates smoothly whenever `value` changes. */
export default function CountUp({ value, decimals, duration = 1.4, className, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const target = Number(value) || 0;
  const dp = decimals ?? (Number.isInteger(target) ? 0 : 1);
  const [display, setDisplay] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (!inView && !reduce) return;
    if (reduce) {
      currentRef.current = target;
      setDisplay(target);
      return;
    }
    const controls = animate(currentRef.current, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        currentRef.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [inView, target, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(dp)}
      {suffix}
    </span>
  );
}
