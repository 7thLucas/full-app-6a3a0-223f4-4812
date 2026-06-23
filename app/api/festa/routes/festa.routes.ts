import { Router } from "express";
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  createLead,
  listLeads,
  updateLeadStatus,
  listFavorites,
  listFavoriteIds,
  toggleFavorite,
  getAnalytics,
  getLeadStats,
} from "../controllers/festa.controller";

const router = Router();

// Projects
router.get("/festa/projects", listProjects);
router.post("/festa/projects", createProject);
router.get("/festa/projects/:slug", getProject);
router.patch("/festa/projects/:id", updateProject);
router.delete("/festa/projects/:id", deleteProject);

// Units
router.get("/festa/units", listUnits);
router.post("/festa/units", createUnit);
router.get("/festa/units/:slug", getUnit);
router.patch("/festa/units/:id", updateUnit);
router.delete("/festa/units/:id", deleteUnit);

// Leads (north star)
router.post("/festa/leads", createLead);
router.get("/festa/leads", listLeads);
router.get("/festa/leads/stats", getLeadStats);
router.patch("/festa/leads/:id", updateLeadStatus);

// Favorites
router.get("/festa/favorites", listFavorites);
router.get("/festa/favorites/ids", listFavoriteIds);
router.post("/festa/favorites/toggle", toggleFavorite);

// Analytics
router.get("/festa/analytics", getAnalytics);

export default router;
