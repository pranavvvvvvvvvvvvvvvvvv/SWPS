import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/water";
import { useI18n } from "@/lib/LanguageContext";

export default function StatusPill({ status = "safe", label, className, showLabel = true }) {
  const { t } = useI18n();
  const style = STATUS_STYLES[status] || STATUS_STYLES.unknown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        style.chip,
        className
      )}
    >
      <span className={cn("relative h-1.5 w-1.5 rounded-full", style.dot)} />
      {showLabel && (label || t(`status.${status}`, style.label))}
    </span>
  );
}
