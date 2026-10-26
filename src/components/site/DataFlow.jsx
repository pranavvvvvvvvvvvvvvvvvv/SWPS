import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Animated data-flow connector: dots travel down the line between
 *  architecture blocks. Static arrow under prefers-reduced-motion. */
export default function DataFlow({ className }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex justify-center py-2", className)} aria-hidden>
      <div className="relative h-10 w-px bg-border">
        {reduce ? (
          <ArrowDown className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-border" />
        ) : (
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-primary/70"
              style={{ left: "calc(50% - 3px)" }}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 38, opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          ))
        )}
      </div>
    </div>
  );
}
