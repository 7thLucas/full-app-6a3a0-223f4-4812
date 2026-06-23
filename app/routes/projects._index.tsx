import { useEffect, useState } from "react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { ProjectCard } from "~/festa/components/ProjectCard";
import { CardSkeleton } from "~/festa/components/Spinner";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import { festaApi } from "~/festa/lib/api";
import type { Project } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Projects — Festa" }];
}

export default function ProjectsPage() {
  const { config } = useFestaConfig();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await festaApi.listProjects();
      if (res.success && res.data) setProjects(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Developments</p>
          <h1 className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {config.projectsHeading}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{config.projectsSubheading}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
        {!loading && projects.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">No projects yet.</p>
        )}
      </div>
    </SiteLayout>
  );
}
