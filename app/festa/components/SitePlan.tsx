import { useState } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { formatPrice } from "../lib/format";
import { useFestaConfig } from "../hooks/use-festa-config";
import type { Unit } from "../lib/types";

const DOT_COLORS: Record<string, string> = {
  available: "bg-emerald-500 ring-emerald-200",
  reserved: "bg-amber-500 ring-amber-200",
  sold: "bg-slate-400 ring-slate-300",
};

export function SitePlan({ image, units }: { image?: string; units: Unit[] }) {
  const { config } = useFestaConfig();
  const [active, setActive] = useState<Unit | null>(null);
  const plotted = units.filter((u) => u.plotX || u.plotY);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <LegendDot color="bg-emerald-500" label="Available" />
        <LegendDot color="bg-amber-500" label="Reserved" />
        <LegendDot color="bg-slate-400" label="Sold" />
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary">
        {image && (
          <img src={image} alt="Site plan" className="w-full object-cover" />
        )}
        {plotted.map((u) => (
          <button
            key={u._id}
            onClick={() => setActive(u)}
            style={{ left: `${u.plotX}%`, top: `${u.plotY}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1 ring-4 transition-transform hover:scale-125 focus:outline-none focus:ring-primary",
              DOT_COLORS[u.availability] ?? DOT_COLORS.available,
              active?._id === u._id && "scale-125 ring-primary",
            )}
            aria-label={u.name}
          >
            <span className="block h-3 w-3 rounded-full bg-white/90" />
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {active.coverImage && (
              <img
                src={active.coverImage}
                alt={active.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">{active.name}</p>
                <StatusBadge availability={active.availability} />
              </div>
              <p className="text-sm text-muted-foreground">
                {active.bedrooms} bd · {active.bathrooms} ba · {formatPrice(active.price, config.currencySymbol)}
              </p>
            </div>
          </div>
          <Link
            to={`/units/${active.slug}`}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View unit
          </Link>
        </div>
      )}

      {plotted.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          Unit positions for this development are being mapped.
        </p>
      )}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}
