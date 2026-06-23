import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { AdminShell } from "~/festa/components/admin/AdminShell";
import { ImageUploader } from "~/festa/components/admin/ImageUploader";
import { Spinner } from "~/festa/components/Spinner";
import { festaApi } from "~/festa/lib/api";
import { formatPrice } from "~/festa/lib/format";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import type { Project } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Projects — Festa Admin" }];
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Draft = Partial<Project>;

export default function AdminProjects() {
  const { config } = useFestaConfig();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await festaApi.listProjects();
    if (res.success && res.data) setProjects(res.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing?.name) return;
    setSaving(true);
    const payload: Draft = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
    };
    const res = editing._id
      ? await festaApi.updateProject(editing._id, payload)
      : await festaApi.createProject(payload);
    setSaving(false);
    if (res.success) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await festaApi.deleteProject(id);
    load();
  }

  return (
    <AdminShell>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your developments and portfolio.</p>
        </div>
        <button
          onClick={() => setEditing({ status: "selling", featured: false })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Location</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">From</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.coverImage && (
                        <img src={p.coverImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.developer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.location}</td>
                  <td className="hidden px-4 py-3 font-medium text-foreground md:table-cell">
                    {formatPrice(p.startingPrice, config.currencySymbol)}
                  </td>
                  <td className="px-4 py-3">
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 text-primary">
                        <Star className="h-4 w-4 fill-primary" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(p)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(p._id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No projects yet. Create your first development.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Drawer title={editing._id ? "Edit Project" : "New Project"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Input label="Name" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Developer" value={editing.developer || ""} onChange={(v) => setEditing({ ...editing, developer: v })} />
              <Input label="Tagline" value={editing.tagline || ""} onChange={(v) => setEditing({ ...editing, tagline: v })} />
            </div>
            <Textarea label="Description" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Location" value={editing.location || ""} onChange={(v) => setEditing({ ...editing, location: v })} />
              <Input label="City" value={editing.city || ""} onChange={(v) => setEditing({ ...editing, city: v })} />
            </div>
            <ImageUploader label="Cover image" value={editing.coverImage || ""} onChange={(v) => setEditing({ ...editing, coverImage: v })} />
            <ImageUploader label="Site plan image" value={editing.sitePlanImage || ""} onChange={(v) => setEditing({ ...editing, sitePlanImage: v })} />
            <Textarea label="Payment scheme" value={editing.paymentScheme || ""} onChange={(v) => setEditing({ ...editing, paymentScheme: v })} />
            <Input label="Promotion label" value={editing.promotionLabel || ""} onChange={(v) => setEditing({ ...editing, promotionLabel: v })} />
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Featured on homepage</span>
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving || !editing.name}
              className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground"
            >
              Cancel
            </button>
          </div>
        </Drawer>
      )}
    </AdminShell>
  );
}

export function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg overflow-y-auto bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="festa-input" />
    </label>
  );
}

export function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="festa-input resize-none" />
    </label>
  );
}
