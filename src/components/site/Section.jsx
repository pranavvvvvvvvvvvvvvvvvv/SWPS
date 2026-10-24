import { cn } from "@/lib/utils";

export function Section({ children, className, containerClassName, id }) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <div className={cn("container-page", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-[26px] font-bold leading-[1.15] sm:text-[34px]">{title}</h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, description, children }) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-secondary/50">
      <div className="pointer-events-none absolute inset-0 water-grid opacity-40" />
      <div className="container-page relative py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-[32px] font-bold leading-[1.08] sm:text-[46px]">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </div>
  );
}
