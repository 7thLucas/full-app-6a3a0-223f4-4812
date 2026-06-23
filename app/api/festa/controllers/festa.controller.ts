import type { Request, Response } from "express";
import { ProjectService } from "../services/project.service";
import { UnitService } from "../services/unit.service";
import { LeadService } from "../services/lead.service";
import { FavoriteService } from "../services/favorite.service";
import { AnalyticsService } from "../services/analytics.service";

function ok(res: Response, data: unknown) {
  return res.json({ success: true, data });
}
function fail(res: Response, message: string, code = 400) {
  return res.status(code).json({ success: false, message });
}

// ── Projects ────────────────────────────────────────────────────────────────
export async function listProjects(req: Request, res: Response) {
  try {
    const featured = req.query.featured;
    const filter = featured !== undefined ? { featured: featured === "true" } : {};
    const projects = await ProjectService.list(filter);
    return ok(res, projects);
  } catch (e) {
    return fail(res, "Failed to list projects", 500);
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const slug = String(req.params.slug);
    const project = await ProjectService.getBySlug(slug);
    if (!project) return fail(res, "Project not found", 404);
    const units = await UnitService.listByProject(String(project._id));
    return ok(res, { project, units });
  } catch (e) {
    return fail(res, "Failed to get project", 500);
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const project = await ProjectService.create(req.body);
    return ok(res, project);
  } catch (e) {
    return fail(res, "Failed to create project", 500);
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const project = await ProjectService.update(String(req.params.id), req.body);
    if (!project) return fail(res, "Project not found", 404);
    return ok(res, project);
  } catch (e) {
    return fail(res, "Failed to update project", 500);
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    await ProjectService.remove(String(req.params.id));
    return ok(res, { deleted: true });
  } catch (e) {
    return fail(res, "Failed to delete project", 500);
  }
}

// ── Units ───────────────────────────────────────────────────────────────────
export async function listUnits(req: Request, res: Response) {
  try {
    const { availability, type, minPrice, maxPrice, bedrooms, featured, sort } = req.query;
    const units = await UnitService.list({
      availability: availability ? String(availability) : undefined,
      type: type ? String(type) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      featured: featured !== undefined ? featured === "true" : undefined,
      sort: sort ? String(sort) : undefined,
    });
    return ok(res, units);
  } catch (e) {
    return fail(res, "Failed to list units", 500);
  }
}

export async function getUnit(req: Request, res: Response) {
  try {
    const slug = String(req.params.slug);
    const unit = await UnitService.getBySlug(slug);
    if (!unit) return fail(res, "Unit not found", 404);
    await UnitService.incrementViews(String(unit._id));
    const project = await ProjectService.getById(unit.projectId);
    return ok(res, { unit, project });
  } catch (e) {
    return fail(res, "Failed to get unit", 500);
  }
}

export async function createUnit(req: Request, res: Response) {
  try {
    const unit = await UnitService.create(req.body);
    if (unit?.projectId) await ProjectService.refreshPricing(unit.projectId);
    return ok(res, unit);
  } catch (e) {
    return fail(res, "Failed to create unit", 500);
  }
}

export async function updateUnit(req: Request, res: Response) {
  try {
    const unit = await UnitService.update(String(req.params.id), req.body);
    if (!unit) return fail(res, "Unit not found", 404);
    if (unit.projectId) await ProjectService.refreshPricing(unit.projectId);
    return ok(res, unit);
  } catch (e) {
    return fail(res, "Failed to update unit", 500);
  }
}

export async function deleteUnit(req: Request, res: Response) {
  try {
    const unit = await UnitService.getById(String(req.params.id));
    await UnitService.remove(String(req.params.id));
    if (unit?.projectId) await ProjectService.refreshPricing(unit.projectId);
    return ok(res, { deleted: true });
  } catch (e) {
    return fail(res, "Failed to delete unit", 500);
  }
}

// ── Leads (north star) ───────────────────────────────────────────────────────
export async function createLead(req: Request, res: Response) {
  try {
    const { name, phone, intent } = req.body || {};
    if (!name || !phone || !intent) {
      return fail(res, "Name, phone, and intent are required");
    }
    const lead = await LeadService.create(req.body);
    return ok(res, lead);
  } catch (e) {
    return fail(res, "Failed to submit lead", 500);
  }
}

export async function listLeads(req: Request, res: Response) {
  try {
    const { status, intent } = req.query;
    const leads = await LeadService.list({
      status: status ? String(status) : undefined,
      intent: intent ? String(intent) : undefined,
    });
    return ok(res, leads);
  } catch (e) {
    return fail(res, "Failed to list leads", 500);
  }
}

export async function updateLeadStatus(req: Request, res: Response) {
  try {
    const { status } = req.body || {};
    if (!status) return fail(res, "status is required");
    const lead = await LeadService.updateStatus(String(req.params.id), status);
    if (!lead) return fail(res, "Lead not found", 404);
    return ok(res, lead);
  } catch (e) {
    return fail(res, "Failed to update lead", 500);
  }
}

// ── Favorites ────────────────────────────────────────────────────────────────
export async function listFavorites(req: Request, res: Response) {
  try {
    const visitorId = String(req.query.visitorId || "");
    if (!visitorId) return ok(res, []);
    const ids = await FavoriteService.unitIds(visitorId);
    if (ids.length === 0) return ok(res, []);
    const units = await UnitService.getManyByIds(ids);
    return ok(res, units);
  } catch (e) {
    return fail(res, "Failed to list favorites", 500);
  }
}

export async function listFavoriteIds(req: Request, res: Response) {
  try {
    const visitorId = String(req.query.visitorId || "");
    if (!visitorId) return ok(res, []);
    const ids = await FavoriteService.unitIds(visitorId);
    return ok(res, ids);
  } catch (e) {
    return fail(res, "Failed to list favorite ids", 500);
  }
}

export async function toggleFavorite(req: Request, res: Response) {
  try {
    const { visitorId, unitId } = req.body || {};
    if (!visitorId || !unitId) return fail(res, "visitorId and unitId are required");
    const result = await FavoriteService.toggle(visitorId, unitId);
    return ok(res, result);
  } catch (e) {
    return fail(res, "Failed to toggle favorite", 500);
  }
}

// ── Analytics ────────────────────────────────────────────────────────────────
export async function getAnalytics(_req: Request, res: Response) {
  try {
    const data = await AnalyticsService.overview();
    return ok(res, data);
  } catch (e) {
    return fail(res, "Failed to load analytics", 500);
  }
}

export async function getLeadStats(_req: Request, res: Response) {
  try {
    const data = await LeadService.stats();
    return ok(res, data);
  } catch (e) {
    return fail(res, "Failed to load lead stats", 500);
  }
}
