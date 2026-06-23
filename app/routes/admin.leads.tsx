import { useEffect, useState } from "react";
import { Phone, Mail, Calendar, Building2, Home } from "lucide-react";
import { AdminShell } from "~/festa/components/admin/AdminShell";
import { Spinner } from "~/festa/components/Spinner";
import { festaApi } from "~/festa/lib/api";
import { buildWhatsappLink } from "~/festa/lib/format";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import type { Lead, LeadStatus } from "~/festa/lib/types";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Leads — Festa Admin" }];
}

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const INTENT_STYLE: Record<string, string> = {
  inquiry: "bg-sky-100 text-sky-700",
  "site-visit": "bg-amber-100 text-amber-700",
  booking: "bg-emerald-100 text-emerald-700",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-sky-100 text-sky-700",
  qualified: "bg-amber-100 text-amber-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-slate-200 text-slate-500",
};

export default function AdminLeads() {
  const { config } = useFestaConfig();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function load() {
    setLoading(true);
    const res = await festaApi.listLeads(filter ? { status: filter } : undefined);
    if (res.success && res.data) setLeads(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function changeStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: status as LeadStatus } : l)));
    await festaApi.updateLeadStatus(id, status);
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Leads</h1>
          <p className="text-muted-foreground">Captured intent — work them before they cool.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={filter === ""} onClick={() => setFilter("")}>All</Chip>
          {STATUS_OPTIONS.map((s) => (
            <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : leads.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No leads in this view yet.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead._id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground">{lead.name}</h3>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", INTENT_STYLE[lead.intent])}>
                      {lead.intent.replace("-", " ")}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> {lead.phone}
                    </span>
                    {lead.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-primary" /> {lead.email}
                      </span>
                    )}
                    {lead.preferredDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {lead.preferredDate}
                      </span>
                    )}
                  </div>
                  {(lead.projectName || lead.unitName) && (
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      {lead.projectName && (
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5" /> {lead.projectName}
                        </span>
                      )}
                      {lead.unitName && (
                        <span className="inline-flex items-center gap-1.5">
                          <Home className="h-3.5 w-3.5" /> {lead.unitName}
                        </span>
                      )}
                    </div>
                  )}
                  {lead.message && (
                    <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm text-foreground">
                      "{lead.message}"
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => changeStatus(lead._id, e.target.value)}
                    className={cn(
                      "rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize outline-none ring-1 ring-inset ring-border",
                      STATUS_STYLE[lead.status],
                    )}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <a
                    href={buildWhatsappLink(
                      lead.phone,
                      `Hi ${lead.name}, this is ${config.agentName} from ${config.appName}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-semibold text-white"
                  >
                    WhatsApp
                  </a>
                  {lead.createdAt && (
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
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
        "rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
