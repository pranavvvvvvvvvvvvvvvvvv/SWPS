import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

/** A router link with a soft ripple on click and a small hover lift.
 *  `rippleClass` sets the ripple colour (dark on light buttons, light on primary). */
export default function RippleLink({
  to,
  className,
  rippleClass = "bg-white/25",
  lift = true,
  onClick,
  children,
  ...rest
}) {
  const [ripples, setRipples] = useState([]);
  const reduce = useReducedMotion();

  const handleMouseDown = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    setRipples((rs) => [
      ...rs.slice(-2),
      { id: `${Date.now()}-${rs.length}`, x: e.clientX - rect.left, y: e.clientY - rect.top, size },
    ]);
  };

  return (
    <MotionLink
      to={to}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      whileHover={lift && !reduce ? { y: -2 } : undefined}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={cn("relative overflow-hidden", className)}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          className={cn("pointer-events-none absolute rounded-full", rippleClass)}
          style={{ left: r.x, top: r.y, width: r.size, height: r.size, x: "-50%", y: "-50%" }}
          initial={{ opacity: 0.45, scale: 0.15 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          onAnimationComplete={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
        />
      ))}
    </MotionLink>
  );
}
