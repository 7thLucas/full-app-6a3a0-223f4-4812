import { Link } from "react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { formatPrice } from "../lib/format";
import { useFestaConfig } from "../hooks/use-festa-config";
import type { Project } from "../lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const { config } = useFestaConfig();

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {project.coverImage && (
          <img
            src={project.coverImage}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/5 to-transparent" />
        {config.showPromotions && project.promotionLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
            {project.promotionLabel}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground">
          <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm">{project.name}</h3>
          {project.location && (
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-white/90 drop-shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              {project.location}
              {project.city ? `, ${project.city}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-end justify-between gap-3 p-4">
        <div>
          {project.developer && (
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {project.developer}
            </p>
          )}
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{project.tagline}</p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-extrabold text-foreground">
              {formatPrice(project.startingPrice, config.currencySymbol)}
            </span>
          </p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
