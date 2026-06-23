import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  Home,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: Building2 },
  { to: "/admin/units", label: "Units", icon: Home },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { config } = useFestaConfig();
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold leading-tight text-white">{config.appName}</p>
            <p className="text-[10px] uppercase tracking-wider text-sidebar-foreground/70">Developer Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" /> View live site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top nav */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
          {NAV.map((n) => {
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
