import { apiRequest } from "~/lib/api.client";
import type {
  Project,
  Unit,
  Lead,
  LeadIntent,
  AnalyticsOverview,
} from "./types";

export const festaApi = {
  // Projects
  listProjects: (featured?: boolean) =>
    apiRequest<Project[]>("/api/festa/projects", {
      method: "GET",
      params: featured !== undefined ? { featured } : undefined,
    }),
  getProject: (slug: string) =>
    apiRequest<{ project: Project; units: Unit[] }>(`/api/festa/projects/${slug}`, {
      method: "GET",
    }),
  createProject: (data: Partial<Project>) =>
    apiRequest<Project>("/api/festa/projects", { method: "POST", data }),
  updateProject: (id: string, data: Partial<Project>) =>
    apiRequest<Project>(`/api/festa/projects/${id}`, { method: "PATCH", data }),
  deleteProject: (id: string) =>
    apiRequest(`/api/festa/projects/${id}`, { method: "DELETE" }),

  // Units
  listUnits: (params?: Record<string, unknown>) =>
    apiRequest<Unit[]>("/api/festa/units", { method: "GET", params }),
  getUnit: (slug: string) =>
    apiRequest<{ unit: Unit; project: Project }>(`/api/festa/units/${slug}`, {
      method: "GET",
    }),
  createUnit: (data: Partial<Unit>) =>
    apiRequest<Unit>("/api/festa/units", { method: "POST", data }),
  updateUnit: (id: string, data: Partial<Unit>) =>
    apiRequest<Unit>(`/api/festa/units/${id}`, { method: "PATCH", data }),
  deleteUnit: (id: string) =>
    apiRequest(`/api/festa/units/${id}`, { method: "DELETE" }),

  // Leads
  createLead: (data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    intent: LeadIntent;
    projectId?: string;
    projectName?: string;
    unitId?: string;
    unitName?: string;
    preferredDate?: string;
  }) => apiRequest<Lead>("/api/festa/leads", { method: "POST", data }),
  listLeads: (params?: Record<string, unknown>) =>
    apiRequest<Lead[]>("/api/festa/leads", { method: "GET", params }),
  updateLeadStatus: (id: string, status: string) =>
    apiRequest<Lead>(`/api/festa/leads/${id}`, { method: "PATCH", data: { status } }),

  // Favorites
  listFavorites: (visitorId: string) =>
    apiRequest<Unit[]>("/api/festa/favorites", { method: "GET", params: { visitorId } }),
  listFavoriteIds: (visitorId: string) =>
    apiRequest<string[]>("/api/festa/favorites/ids", { method: "GET", params: { visitorId } }),
  toggleFavorite: (visitorId: string, unitId: string) =>
    apiRequest<{ favorited: boolean }>("/api/festa/favorites/toggle", {
      method: "POST",
      data: { visitorId, unitId },
    }),

  // Analytics
  getAnalytics: () =>
    apiRequest<AnalyticsOverview>("/api/festa/analytics", { method: "GET" }),

  // Upload (via @qb/uploader scaffold)
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiRequest<{ url: string; path: string }>("/api/uploader/image", {
      method: "POST",
      data: form,
    });
  },
};
