import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { UnitCard } from "~/festa/components/UnitCard";
import { CardSkeleton } from "~/festa/components/Spinner";
import { festaApi } from "~/festa/lib/api";
import type { Unit } from "~/festa/lib/types";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Browse Units — Festa" }];
}

const AVAILABILITY = [
  { value: "", label: "All" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

const SORTS = [
  { value: "", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function UnitsPage() {
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [sort, setSort] = useState("");

  useEffect(() => {
    (async () => {
      const res = await festaApi.listUnits();
      if (res.success && res.data) setAllUnits(res.data);
      setLoading(false);
    })();
  }, []);

  const types = useMemo(
    () => Array.from(new Set(allUnits.map((u) => u.type).filter(Boolean))) as string[],
    [allUnits],
  );

  const filtered = useMemo(() => {
    let list = allUnits.filter((u) => {
      if (availability && u.availability !== availability) return false;
      if (type && u.type !== type) return false;
      if (bedrooms && (u.bedrooms ?? 0) < bedrooms) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allUnits, availability, type, bedrooms, sort]);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Inventory</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Browse Available Units
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Filter by status, type, and size — then inquire or book a visit on the spot.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterGroup label="Availability">
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((a) => (
                  <Chip key={a.value} active={availability === a.value} onClick={() => setAvailability(a.value)}>
                    {a.label}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Type">
              <div className="flex flex-wrap gap-2">
                <Chip active={type === ""} onClick={() => setType("")}>All</Chip>
                {types.map((t) => (
                  <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Min Bedrooms">
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4].map((b) => (
                  <Chip key={b} active={bedrooms === b} onClick={() => setBedrooms(b)}>
                    {b === 0 ? "Any" : `${b}+`}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Sort by">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="festa-input"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FilterGroup>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {loading ? "Loading..." : `${filtered.length} unit${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((u) => <UnitCard key={u._id} unit={u} />)}
        </div>
        {!loading && filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            No units match your filters. Try widening your search.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
