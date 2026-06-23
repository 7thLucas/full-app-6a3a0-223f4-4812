import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "~/festa/components/admin/AdminShell";
import { ImageUploader } from "~/festa/components/admin/ImageUploader";
import { StatusBadge } from "~/festa/components/StatusBadge";
import { Spinner } from "~/festa/components/Spinner";
import { Drawer, Input, Textarea } from "./admin.projects";
import { festaApi } from "~/festa/lib/api";
import { formatFullPrice } from "~/festa/lib/format";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import type { Project, Unit } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Units — Festa Admin" }];
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type Draft = Partial<Unit>;

export default function AdminUnits() {
  const { config } = useFestaConfig();
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [u, p] = await Promise.all([festaApi.listUnits(), festaApi.listProjects()]);
    if (u.success && u.data) setUnits(u.data);
    if (p.success && p.data) setProjects(p.data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function projectName(id?: string) {
    return projects.find((p) => p._id === id)?.name ?? "—";
  }

  async function save() {
    if (!editing?.name || !editing.projectId) return;
    setSaving(true);
    const payload: Draft = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
      price: Number(editing.price) || 0,
      bedrooms: Number(editing.bedrooms) || 0,
      bathrooms: Number(editing.bathrooms) || 0,
      landSize: Number(editing.landSize) || 0,
      buildingSize: Number(editing.buildingSize) || 0,
      floors: Number(editing.floors) || 0,
      carports: Number(editing.carports) || 0,
    };
    const res = editing._id
      ? await festaApi.updateUnit(editing._id, payload)
      : await festaApi.createUnit(payload);
    setSaving(false);
    if (res.success) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this unit?")) return;
    await festaApi.deleteUnit(id);
    load();
  }

  return (
    <AdminShell>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Units</h1>
          <p className="text-muted-foreground">Manage inventory, pricing, and availability.</p>
        </div>
        <button
          onClick={() =>
            setEditing({ availability: "available", projectId: projects[0]?._id })
          }
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> New Unit
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
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">Project</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {units.map((u) => (
                <tr key={u._id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.coverImage && (
                        <img src={u.coverImage} alt="" className="h-10 w-14 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{projectName(u.projectId)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge availability={u.availability} />
                  </td>
                  <td className="hidden px-4 py-3 font-medium text-foreground md:table-cell">
                    {formatFullPrice(u.price, config.currencySymbol)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing(u)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(u._id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No units yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Drawer title={editing._id ? "Edit Unit" : "New Unit"} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Project</span>
              <select
                value={editing.projectId || ""}
                onChange={(e) => setEditing({ ...editing, projectId: e.target.value })}
                className="festa-input"
              >
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Unit name" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
              <Input label="Type" value={editing.type || ""} onChange={(v) => setEditing({ ...editing, type: v })} />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-foreground">Availability</span>
              <select
                value={editing.availability || "available"}
                onChange={(e) => setEditing({ ...editing, availability: e.target.value as Unit["availability"] })}
                className="festa-input"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </label>
            <Input label="Price" type="number" value={editing.price ?? 0} onChange={(v) => setEditing({ ...editing, price: Number(v) })} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Beds" type="number" value={editing.bedrooms ?? 0} onChange={(v) => setEditing({ ...editing, bedrooms: Number(v) })} />
              <Input label="Baths" type="number" value={editing.bathrooms ?? 0} onChange={(v) => setEditing({ ...editing, bathrooms: Number(v) })} />
              <Input label="Floors" type="number" value={editing.floors ?? 0} onChange={(v) => setEditing({ ...editing, floors: Number(v) })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Land m²" type="number" value={editing.landSize ?? 0} onChange={(v) => setEditing({ ...editing, landSize: Number(v) })} />
              <Input label="Building m²" type="number" value={editing.buildingSize ?? 0} onChange={(v) => setEditing({ ...editing, buildingSize: Number(v) })} />
              <Input label="Carports" type="number" value={editing.carports ?? 0} onChange={(v) => setEditing({ ...editing, carports: Number(v) })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Plot X (%)" type="number" value={editing.plotX ?? 0} onChange={(v) => setEditing({ ...editing, plotX: Number(v) })} />
              <Input label="Plot Y (%)" type="number" value={editing.plotY ?? 0} onChange={(v) => setEditing({ ...editing, plotY: Number(v) })} />
            </div>
            <ImageUploader label="Cover image" value={editing.coverImage || ""} onChange={(v) => setEditing({ ...editing, coverImage: v })} />
            <ImageUploader label="Floor plan image" value={editing.floorPlanImage || ""} onChange={(v) => setEditing({ ...editing, floorPlanImage: v })} />
            <Textarea label="Description" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} />
            <Input label="Payment scheme" value={editing.paymentScheme || ""} onChange={(v) => setEditing({ ...editing, paymentScheme: v })} />
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={!!editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Featured unit</span>
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving || !editing.name || !editing.projectId}
              className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Unit"}
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
