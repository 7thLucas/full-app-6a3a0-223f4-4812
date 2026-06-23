// Import global routes
import routes from "./routes";
import { initializeModels } from "./models";
import { festaRoutes } from "./festa";

// Initialize models (module-discovered)
await initializeModels();

// Mount Festa domain routes (lives outside app/modules/*)
routes.use(festaRoutes);

// NOTE: Festa demo data is seeded by runSeeds() AFTER the MongoDB connection
// is established (see app/api/seeds/index.ts). Do NOT seed here at import time:
// this module is imported by server.ts before connectMongoDB() runs, so a
// top-level await seedFesta() would query before the DB is connected and time out.

export default routes;
