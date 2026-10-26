import InteractiveCard from "@/components/site/InteractiveCard";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { cn } from "@/lib/utils";

/** One step of the purification flow. `state` lights it up as the scroll
 *  droplet passes: idle → passed → active. */
export default function FlowCard({ step, index, state = "idle" }) {
  const tr = useAutoTranslate();
  const Icon = step.icon;

  return (
    <InteractiveCard
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border bg-card p-5 transition-colors duration-500",
        state === "active" && "border-primary/60 ring-2 ring-primary/25",
        state === "passed" && "border-primary/30",
        state === "idle" && "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="icon-bob flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground/60">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-[13.5px] font-semibold leading-snug">{tr(step.title)}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{tr(step.text)}</p>
      <span className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-primary to-sky-400 transition-all duration-500 group-hover:w-full" />
    </InteractiveCard>
  );
}
