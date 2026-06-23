import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { UnitCard } from "~/festa/components/UnitCard";
import { CardSkeleton } from "~/festa/components/Spinner";
import { festaApi } from "~/festa/lib/api";
import { useVisitorId } from "~/festa/hooks/use-visitor";
import { useFavorites } from "~/festa/hooks/use-favorites";
import type { Unit } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Saved Units — Festa" }];
}

export default function FavoritesPage() {
  const visitorId = useVisitorId();
  const { ids } = useFavorites();
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visitorId) return;
    (async () => {
      const res = await festaApi.listFavorites(visitorId);
      if (res.success && res.data) setUnits(res.data);
      setLoading(false);
    })();
    // re-fetch when favorite ids change (add/remove)
  }, [visitorId, ids.length]);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Shortlist</p>
          <h1 className="mt-1.5 inline-flex items-center gap-2.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            <Heart className="h-7 w-7 fill-primary text-primary" />
            Saved Units
          </h1>
          <p className="mt-2 text-muted-foreground">The units you're keeping an eye on.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : units.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {units.map((u) => (
              <UnitCard key={u._id} unit={u} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Heart className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-foreground">No saved units yet</h2>
            <p className="mt-1 max-w-sm text-muted-foreground">
              Tap the heart on any unit to shortlist it here.
            </p>
            <Link
              to="/units"
              className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
            >
              Browse units
            </Link>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
