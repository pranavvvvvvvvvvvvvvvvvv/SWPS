import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/** The shared interactive card: a spotlight gradient that follows the
 *  pointer, a gentle 3D tilt toward the cursor, a blue glow + lift on hover,
 *  and an optional `icon` that bobs on hover. Fully static (no tilt, no
 *  pointer effects) under prefers-reduced-motion and on touch pointers. */
export default function InteractiveCard({
  className,
  children,
  icon: Icon,
  iconClassName,
  lift = true,
  tilt = true,
  ...rest
}) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 220, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 24 });
  const canTilt =
    tilt &&
    !reduce &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    if (!canTilt) return;
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 4);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={cn("spotlight group/card relative", lift && "card-lift", className)}
      {...rest}
    >
      {Icon && (
        <span className={cn("icon-bob inline-flex items-center justify-center", iconClassName)}>
          <Icon />
        </span>
      )}
      {children}
    </motion.div>
  );
}
