import { Link } from "react-router";
import { Bed, Bath, Ruler, Heart } from "lucide-react";
import { cn } from "~/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { formatPrice } from "../lib/format";
import { useFestaConfig } from "../hooks/use-festa-config";
import { useFavorites } from "../hooks/use-favorites";
import type { Unit } from "../lib/types";

export function UnitCard({ unit }: { unit: Unit }) {
  const { config } = useFestaConfig();
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(unit._id);

  return (
    <Link
      to={`/units/${unit.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {unit.coverImage && (
          <img
            src={unit.coverImage}
            alt={unit.name}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
              unit.availability === "sold" && "grayscale",
            )}
          />
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge availability={unit.availability} />
        </div>
        {config.showFavorites && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(unit._id);
            }}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
            aria-label="Save"
          >
            <Heart className={cn("h-4 w-4", fav && "fill-primary text-primary")} />
          </button>
        )}
        {unit.featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight text-foreground">{unit.name}</h3>
        </div>
        {unit.type && (
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {unit.type}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {!!unit.bedrooms && (
            <span className="inline-flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-primary" />
              {unit.bedrooms}
            </span>
          )}
          {!!unit.bathrooms && (
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-primary" />
              {unit.bathrooms}
            </span>
          )}
          {!!unit.buildingSize && (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-primary" />
              {unit.buildingSize} m²
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              From
            </p>
            <p className="text-lg font-extrabold text-foreground">
              {formatPrice(unit.price, config.currencySymbol)}
            </p>
          </div>
          <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
