import { cn } from "~/lib/utils";
import { availabilityLabel } from "../lib/format";

const STYLES: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  reserved: "bg-amber-100 text-amber-700 ring-amber-200",
  sold: "bg-slate-200 text-slate-500 ring-slate-300",
};

const DOT: Record<string, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-slate-400",
};

export function StatusBadge({
  availability,
  className,
}: {
  availability: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STYLES[availability] ?? STYLES.available,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[availability] ?? DOT.available)} />
      {availabilityLabel(availability)}
    </span>
  );
}
