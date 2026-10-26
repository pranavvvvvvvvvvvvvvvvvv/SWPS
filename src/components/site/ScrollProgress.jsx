import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin blue bar at the very top of the page that grows as the user scrolls. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-primary via-sky-400 to-sky-500"
      style={{ scaleX }}
    />
  );
}
