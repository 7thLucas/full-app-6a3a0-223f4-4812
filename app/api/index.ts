// Import global routes
import routes from "./routes";
import { initializeModels } from "./models";
import { festaRoutes, seedFesta } from "./festa";

// Initialize models (module-discovered)
await initializeModels();

// Mount Festa domain routes (lives outside app/modules/*)
routes.use(festaRoutes);

// Seed Festa demo data (idempotent: early-returns when data exists)
await seedFesta();

export default routes;
