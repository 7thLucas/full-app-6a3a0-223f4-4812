import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Search, MapPin, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { ProjectCard } from "~/festa/components/ProjectCard";
import { UnitCard } from "~/festa/components/UnitCard";
import { CardSkeleton } from "~/festa/components/Spinner";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import { festaApi } from "~/festa/lib/api";
import type { Project, Unit } from "~/festa/lib/types";

export function meta() {
  return [
    { title: "Festa — Premium Property Sales Platform" },
    {
      name: "description",
      content:
        "Browse premium developments and available units. Inquire or book a site visit the moment you're ready.",
    },
  ];
}

export default function IndexPage() {
  const { config } = useFestaConfig();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredUnits, setFeaturedUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [proj, units] = await Promise.all([
        festaApi.listProjects(true),
        festaApi.listUnits({ featured: true }),
      ]);
      if (proj.success && proj.data) setFeaturedProjects(proj.data);
      if (units.success && units.data) setFeaturedUnits(units.data.slice(0, 4));
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {config.heroImage && (
            <img
              src={config.heroImage}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/20" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in srgb, var(--primary) 35%, transparent), transparent 60%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {config.heroEyebrow}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {config.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
              {config.heroSubtitle}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
              >
                {config.heroCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/units"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
              >
                <Search className="h-4 w-4" />
                {config.heroSecondaryCtaLabel}
              </Link>
            </div>

            {config.heroStats?.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
                {config.heroStats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold text-white">{s.value}</p>
                    <p className="text-sm text-white/80">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <TrustItem icon={<ShieldCheck className="h-5 w-5" />} title="Verified listings" desc="Every unit, spec, and price kept up to date." />
          <TrustItem icon={<Clock className="h-5 w-5" />} title="Fast response" desc="Inquiries routed to an advisor right away." />
          <TrustItem icon={<MapPin className="h-5 w-5" />} title="Site visits" desc="Book a private viewing in a few taps." />
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Featured Developments"
          title={config.featuredHeading}
          subtitle={config.featuredSubheading}
          to="/projects"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : featuredProjects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      </section>

      {/* Featured units */}
      {(loading || featuredUnits.length > 0) && (
        <section className="bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Move-in ready"
              title="Standout Units"
              subtitle="Units our buyers love — browse, then inquire or book a visit on the spot."
              to="/units"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
                : featuredUnits.map((u) => <UnitCard key={u._id} unit={u} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-center sm:px-16 sm:py-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
            Found something you love?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Browse every available unit and book a site visit before it's gone.
          </p>
          <Link
            to="/units"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
          >
            Browse all units
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  to,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  to: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-muted-foreground">{subtitle}</p>
      </div>
      <Link
        to={to}
        className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
