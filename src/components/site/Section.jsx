import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import WaveDivider from "@/components/site/WaveDivider";
import Reveal from "@/components/site/Reveal";

const EASE = [0.22, 1, 0.36, 1];

export function Section({ children, className, containerClassName, id, waveTop }) {
  const reduce = useReducedMotion();
  return (
    <section id={id} className={cn("relative py-16 sm:py-20", className)}>
      {waveTop && <WaveDivider className={cn("absolute inset-x-0 top-0", waveTop)} />}
      <div className={cn("container-page relative", containerClassName)}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** Heading with a line that draws under the eyebrow label and a title that
 *  reveals with a clip mask (static when prefers-reduced-motion is set). */
export function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <div className="mb-3">
          <motion.p
            className="eyebrow"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          {!reduce && (
            <motion.span
              className={cn("mt-2 block h-px w-14 origin-left bg-primary/40", align === "center" && "mx-auto")}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            />
          )}
        </div>
      )}
      <span className="block overflow-hidden">
        <motion.h2
          className="text-[26px] font-bold leading-[1.15] sm:text-[34px]"
          initial={reduce ? false : { y: "112%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          {title}
        </motion.h2>
      </span>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }) {
  const reduce = useReducedMotion();
  const words = String(title ?? "").split(" ");
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/70 via-background to-secondary/40">
      <div className="pointer-events-none absolute inset-0 water-grid opacity-40" />
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 animate-drift rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 animate-drift rounded-full bg-sky-400/10 blur-3xl [animation-delay:1.4s]" />
      <div className="container-page relative py-16 sm:py-20">
        <Reveal className="max-w-3xl">
          {eyebrow && (
            <div className="mb-4">
              <p className="eyebrow">{eyebrow}</p>
              {!reduce && (
                <motion.span
                  className="mt-2 block h-px w-14 origin-left bg-primary/40"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                />
              )}
            </div>
          )}
          <h1 className="text-[32px] font-bold leading-[1.08] sm:text-[46px]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={reduce ? false : { opacity: 0, y: "60%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25 + i * 0.05, ease: EASE }}
              >
                {w}
                {i < words.length - 1 ? "\u00A0" : ""}
              </motion.span>
            ))}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </div>
  );
}
