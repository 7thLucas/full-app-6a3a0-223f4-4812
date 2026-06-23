import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-primary", className)} />;
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-7 w-7" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-secondary" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  );
}
