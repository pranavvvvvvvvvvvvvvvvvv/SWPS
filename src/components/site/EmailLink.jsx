import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoTranslate } from "@/lib/AutoTranslate";

export const DEVELOPER_EMAIL = "chpranav559@gmail.com";

/** The developer's real email: a mailto link with a copy button that
 *  confirms with a small "Copied" state. */
export default function EmailLink({ className }) {
  const tr = useAutoTranslate();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <a
        href={`mailto:${DEVELOPER_EMAIL}`}
        className="inline-flex items-center gap-1.5 font-medium transition hover:text-primary"
      >
        <Mail className="h-3.5 w-3.5 text-primary" />
        {DEVELOPER_EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={tr("Copy email address")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold transition",
          copied
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
        )}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? tr("Copied") : tr("Copy")}
      </button>
    </span>
  );
}
