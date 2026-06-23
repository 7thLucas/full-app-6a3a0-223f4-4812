import { Link, useLocation } from "react-router";
import { Heart, Menu, X, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useFestaConfig } from "../hooks/use-festa-config";
import { useFavorites } from "../hooks/use-favorites";

const NAV = [
  { label: "Projects", to: "/projects" },
  { label: "Units", to: "/units" },
  { label: "Financing", to: "/financing" },
];

export function SiteHeader() {
  const { config } = useFestaConfig();
  const { count } = useFavorites();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-navbar/95 backdrop-blur supports-[backdrop-filter]:bg-navbar/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          {config.logoUrl ? (
            <img src={config.logoUrl} alt={config.appName} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </span>
          )}
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            {config.appName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(n.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {config.showFavorites && (
            <Link
              to="/favorites"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          )}
          <Link
            to="/projects"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Explore
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-navbar md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium",
                  isActive(n.to) ? "bg-primary/10 text-primary" : "text-foreground",
                )}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
