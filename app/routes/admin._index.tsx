import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Inbox,
  Eye,
  Target,
  Home,
  TrendingUp,
  CalendarCheck,
  BadgeCheck,
  MessageSquare,
} from "lucide-react";
import { AdminShell } from "~/festa/components/admin/AdminShell";
import { Spinner } from "~/festa/components/Spinner";
import { festaApi } from "~/festa/lib/api";
import { StatusBadge } from "~/festa/components/StatusBadge";
import type { AnalyticsOverview } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Admin Overview — Festa" }];
}

export default function AdminOverview() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await festaApi.getAnalytics();
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Overview</h1>
        <p className="text-muted-foreground">
          Track what's converting — the north star is qualified leads captured.
        </p>
      </div>

      {loading || !data ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          {/* North star band */}
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm lg:col-span-1">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Qualified Leads</span>
              </div>
              <p className="mt-2 text-4xl font-extrabold">{data.qualifiedLeads}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Site visits + bookings captured
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              <Metric icon={<Inbox />} label="Total Leads" value={data.totalLeads} />
              <Metric icon={<Eye />} label="Unit Views" value={data.totalViews} />
              <Metric
                icon={<TrendingUp />}
                label="Conversion"
                value={`${data.conversionRate}%`}
                hint="leads / views"
              />
              <Metric icon={<Home />} label="Available Units" value={data.availableUnits} />
            </div>
          </div>

          {/* Intent breakdown */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <IntentCard icon={<MessageSquare />} label="Inquiries" value={data.inquiries} />
            <IntentCard icon={<CalendarCheck />} label="Site Visits" value={data.visits} />
            <IntentCard icon={<BadgeCheck />} label="Bookings" value={data.bookings} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inventory status */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-bold text-foreground">Inventory Status</h2>
              <StatusBar
                available={data.availableUnits}
                reserved={data.reservedUnits}
                sold={data.soldUnits}
              />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <StatCell label="Available" value={data.availableUnits} color="text-emerald-600" />
                <StatCell label="Reserved" value={data.reservedUnits} color="text-amber-600" />
                <StatCell label="Sold" value={data.soldUnits} color="text-slate-500" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {data.totalProjects} projects · {data.totalUnits} units total
              </p>
            </div>

            {/* Top units */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-foreground">Most-viewed Units</h2>
                <Link to="/admin/units" className="text-sm font-semibold text-primary hover:underline">
                  Manage
                </Link>
              </div>
              <ul className="space-y-3">
                {data.topUnits.map((u, i) => (
                  <li key={u.id} className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">{u.name}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <StatusBadge availability={u.availability} />
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" /> {u.views}
                      </span>
                    </span>
                  </li>
                ))}
                {data.topUnits.length === 0 && (
                  <li className="text-sm text-muted-foreground">No views recorded yet.</li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:h-4.5 [&>svg]:w-4.5">
        {icon}
      </span>
      <p className="mt-3 text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">
        {label}
        {hint ? ` · ${hint}` : ""}
      </p>
    </div>
  );
}

function IntentCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>
      <div>
        <p className="text-2xl font-extrabold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function StatusBar({
  available,
  reserved,
  sold,
}: {
  available: number;
  reserved: number;
  sold: number;
}) {
  const total = Math.max(available + reserved + sold, 1);
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
      <div className="bg-emerald-500" style={{ width: `${(available / total) * 100}%` }} />
      <div className="bg-amber-500" style={{ width: `${(reserved / total) * 100}%` }} />
      <div className="bg-slate-400" style={{ width: `${(sold / total) * 100}%` }} />
    </div>
  );
}

function StatCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
