import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Building2,
  CreditCard,
  Navigation,
} from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { UnitCard } from "~/festa/components/UnitCard";
import { SitePlan } from "~/festa/components/SitePlan";
import { LeadCaptureModal } from "~/festa/components/LeadCaptureModal";
import { PageLoader } from "~/festa/components/Spinner";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import { festaApi } from "~/festa/lib/api";
import { buildWhatsappLink } from "~/festa/lib/format";
import type { Project, Unit, LeadIntent } from "~/festa/lib/types";
import { MessageCircle } from "lucide-react";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { config } = useFestaConfig();
  const [project, setProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"units" | "siteplan" | "amenities" | "payment">("units");
  const [intent, setIntent] = useState<LeadIntent | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      const res = await festaApi.getProject(slug);
      if (res.success && res.data) {
        setProject(res.data.project);
        setUnits(res.data.units);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <SiteLayout>
        <PageLoader label="Loading development..." />
      </SiteLayout>
    );
  }

  if (!project) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Development not found</h1>
          <Link to="/projects" className="mt-4 inline-block text-primary hover:underline">
            Back to projects
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const available = units.filter((u) => u.availability === "available").length;
  const waMessage = `Hi ${config.agentName}, I'm interested in ${project.name}. Could you share more details?`;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden bg-secondary">
          {project.coverImage && (
            <img src={project.coverImage} alt={project.name} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
              <Link
                to="/projects"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> All developments
              </Link>
              {config.showPromotions && project.promotionLabel && (
                <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  {project.promotionLabel}
                </span>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-2 inline-flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4" />
                {project.location}
                {project.city ? `, ${project.city}` : ""}
                {project.developer ? ` · by ${project.developer}` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="min-w-0">
            <p className="text-lg leading-relaxed text-muted-foreground">{project.description}</p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Units" value={String(units.length)} />
              <Stat label="Available" value={String(available)} />
              <Stat label="From" value={config.currencySymbol + (project.startingPrice ? shortPrice(project.startingPrice) : "—")} />
              <Stat label="Status" value={project.status === "selling" ? "Selling" : project.status || "—"} />
            </div>

            {/* Tabs */}
            <div className="mt-10 flex gap-1 overflow-x-auto border-b border-border">
              <TabButton active={tab === "units"} onClick={() => setTab("units")}>
                Units ({units.length})
              </TabButton>
              <TabButton active={tab === "siteplan"} onClick={() => setTab("siteplan")}>
                Site Plan
              </TabButton>
              <TabButton active={tab === "amenities"} onClick={() => setTab("amenities")}>
                Amenities
              </TabButton>
              <TabButton active={tab === "payment"} onClick={() => setTab("payment")}>
                Payment & Location
              </TabButton>
            </div>

            <div className="mt-8">
              {tab === "units" && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {units.map((u) => (
                    <UnitCard key={u._id} unit={u} />
                  ))}
                  {units.length === 0 && (
                    <p className="text-muted-foreground">No units listed yet.</p>
                  )}
                </div>
              )}

              {tab === "siteplan" && <SitePlan image={project.sitePlanImage} units={units} />}

              {tab === "amenities" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(project.amenities || []).map((a) => (
                    <div
                      key={a.name}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <span className="font-medium text-foreground">{a.name}</span>
                    </div>
                  ))}
                  {(!project.amenities || project.amenities.length === 0) && (
                    <p className="text-muted-foreground">No amenities listed.</p>
                  )}
                </div>
              )}

              {tab === "payment" && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="mb-2 inline-flex items-center gap-2 font-bold text-foreground">
                      <CreditCard className="h-5 w-5 text-primary" /> Payment Scheme
                    </h3>
                    <p className="text-muted-foreground">
                      {project.paymentScheme || "Flexible payment options available — ask an advisor."}
                    </p>
                    {config.showFinancingCalculator && (
                      <Link
                        to="/financing"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                      >
                        Estimate your monthly payment →
                      </Link>
                    )}
                  </div>
                  {(project.nearbyPlaces || []).length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h3 className="mb-3 inline-flex items-center gap-2 font-bold text-foreground">
                        <Navigation className="h-5 w-5 text-primary" /> Nearby
                      </h3>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {project.nearbyPlaces!.map((p) => (
                          <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — lead capture */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                {config.agentPhotoUrl ? (
                  <img
                    src={config.agentPhotoUrl}
                    alt={config.agentName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </span>
                )}
                <div>
                  <p className="font-bold text-foreground">{config.agentName}</p>
                  <p className="text-sm text-muted-foreground">{config.agentRole}</p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => setIntent("site-visit")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {config.bookVisitCtaLabel}
                </button>
                <button
                  onClick={() => setIntent("inquiry")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  {config.inquiryCtaLabel}
                </button>
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
            </div>
          </aside>
        </div>
      </div>

      <LeadCaptureModal
        open={intent !== null}
        onClose={() => setIntent(null)}
        intent={intent ?? "inquiry"}
        project={project}
      />
    </SiteLayout>
  );
}

function shortPrice(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
  return String(v);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-foreground">{value}</p>
    </div>
  );
}

function TabButton({
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
      className={
        "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors " +
        (active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}
