import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Bed,
  Bath,
  Ruler,
  Layers,
  Car,
  Compass,
  Heart,
  CheckCircle2,
  MessageCircle,
  Building2,
} from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { Gallery } from "~/festa/components/Gallery";
import { StatusBadge } from "~/festa/components/StatusBadge";
import { LeadCaptureModal } from "~/festa/components/LeadCaptureModal";
import { PageLoader } from "~/festa/components/Spinner";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import { useFavorites } from "~/festa/hooks/use-favorites";
import { festaApi } from "~/festa/lib/api";
import { formatFullPrice, monthlyPayment, buildWhatsappLink } from "~/festa/lib/format";
import type { Project, Unit, LeadIntent } from "~/festa/lib/types";
import { cn } from "~/lib/utils";

export default function UnitDetailPage() {
  const { slug } = useParams();
  const { config } = useFestaConfig();
  const { isFavorite, toggle } = useFavorites();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState<LeadIntent | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const res = await festaApi.getUnit(slug);
      if (res.success && res.data) {
        setUnit(res.data.unit);
        setProject(res.data.project);
      }
      setLoading(false);
    })();
  }, [slug]);

  const estMonthly = useMemo(() => {
    if (!unit) return 0;
    const principal = unit.price * (1 - config.defaultDownPaymentPercent / 100);
    return monthlyPayment(principal, config.defaultInterestRate, config.defaultTenureYears);
  }, [unit, config]);

  if (loading) {
    return (
      <SiteLayout>
        <PageLoader label="Loading unit..." />
      </SiteLayout>
    );
  }

  if (!unit) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Unit not found</h1>
          <Link to="/units" className="mt-4 inline-block text-primary hover:underline">
            Back to units
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const fav = isFavorite(unit._id);
  const isSold = unit.availability === "sold";
  const images = [unit.coverImage, ...(unit.gallery || [])].filter(Boolean) as string[];
  const waMessage = `Hi ${config.agentName}, I'm interested in ${unit.name}${project ? ` at ${project.name}` : ""}. Could you share more details?`;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <Link
          to={project ? `/projects/${project.slug}` : "/units"}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {project ? `Back to ${project.name}` : "Back to units"}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="min-w-0">
            <Gallery images={images} alt={unit.name} />

            <div className="mt-7 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {unit.name}
                  </h1>
                  <StatusBadge availability={unit.availability} />
                </div>
                <p className="mt-1.5 text-muted-foreground">
                  {unit.type}
                  {project ? ` · ${project.name}` : ""}
                  {project?.location ? ` · ${project.location}` : ""}
                </p>
              </div>
              {config.showFavorites && (
                <button
                  onClick={() => toggle(unit._id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    fav
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-secondary",
                  )}
                >
                  <Heart className={cn("h-4 w-4", fav && "fill-primary")} />
                  {fav ? "Saved" : "Save"}
                </button>
              )}
            </div>

            {/* Spec grid */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Spec icon={<Bed />} label="Bedrooms" value={unit.bedrooms} />
              <Spec icon={<Bath />} label="Bathrooms" value={unit.bathrooms} />
              <Spec icon={<Ruler />} label="Building" value={unit.buildingSize ? `${unit.buildingSize} m²` : "—"} />
              <Spec icon={<Ruler />} label="Land" value={unit.landSize ? `${unit.landSize} m²` : "—"} />
              <Spec icon={<Layers />} label="Floors" value={unit.floors} />
              <Spec icon={<Car />} label="Carports" value={unit.carports} />
            </div>

            {unit.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground">About this unit</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{unit.description}</p>
              </div>
            )}

            {(unit.facilities || []).length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground">Facilities</h2>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {unit.facilities!.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unit.floorPlanImage && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-foreground">Floor plan</h2>
                <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card p-4">
                  <img src={unit.floorPlanImage} alt="Floor plan" className="mx-auto max-h-[480px] object-contain" />
                </div>
              </div>
            )}

            {unit.orientation && (
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Compass className="h-4 w-4 text-primary" /> Orientation: {unit.orientation}
              </p>
            )}
          </div>

          {/* Sidebar — price + conversion */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</p>
              <p className="mt-1 text-3xl font-extrabold text-foreground">
                {formatFullPrice(unit.price, config.currencySymbol)}
              </p>
              {unit.paymentScheme && (
                <p className="mt-1 text-sm text-muted-foreground">{unit.paymentScheme}</p>
              )}

              {config.showFinancingCalculator && estMonthly > 0 && (
                <div className="mt-4 rounded-xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">
                    Est. monthly ({config.defaultDownPaymentPercent}% down, {config.defaultTenureYears} yrs @{" "}
                    {config.defaultInterestRate}%)
                  </p>
                  <p className="text-xl font-extrabold text-foreground">
                    {formatFullPrice(Math.round(estMonthly), config.currencySymbol)}
                    <span className="text-sm font-medium text-muted-foreground"> /mo</span>
                  </p>
                  <Link
                    to="/financing"
                    className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    Open calculator →
                  </Link>
                </div>
              )}

              <div className="mt-5 space-y-2.5">
                {!isSold ? (
                  <>
                    <button
                      onClick={() => setIntent("booking")}
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Book This Unit
                    </button>
                    <button
                      onClick={() => setIntent("site-visit")}
                      className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      {config.bookVisitCtaLabel}
                    </button>
                    <button
                      onClick={() => setIntent("inquiry")}
                      className="inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      {config.inquiryCtaLabel}
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl bg-secondary p-4 text-center text-sm text-muted-foreground">
                    This unit is sold. Ask us about similar availability.
                    <button
                      onClick={() => setIntent("inquiry")}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Find similar units
                    </button>
                  </div>
                )}
                <a
                  href={buildWhatsappLink(config.agentWhatsapp, waMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  {config.whatsappCtaLabel}
                </a>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                {config.agentPhotoUrl ? (
                  <img src={config.agentPhotoUrl} alt={config.agentName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">{config.agentName}</p>
                  <p className="text-xs text-muted-foreground">{config.agentRole}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{unit.name}</p>
            <p className="text-lg font-extrabold text-foreground">
              {formatFullPrice(unit.price, config.currencySymbol)}
            </p>
          </div>
          <button
            onClick={() => setIntent(isSold ? "inquiry" : "site-visit")}
            className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            {isSold ? "Inquire" : config.bookVisitCtaLabel}
          </button>
        </div>
      </div>

      <LeadCaptureModal
        open={intent !== null}
        onClose={() => setIntent(null)}
        intent={intent ?? "inquiry"}
        unit={unit}
        project={project}
      />
    </SiteLayout>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string | undefined;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <p className="mt-2 text-lg font-extrabold text-foreground">{value ?? "—"}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
