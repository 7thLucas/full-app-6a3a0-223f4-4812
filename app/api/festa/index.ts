// Festa domain wiring: register models (import side-effects), routes, and seed.
// This area lives outside app/modules/* and is mounted by the API entrypoint.
import "./models/project.model";
import "./models/unit.model";
import "./models/lead.model";
import "./models/favorite.model";

import festaRoutes from "./routes/festa.routes";
import { seedFesta } from "./seeds/festa.seed";

export { festaRoutes, seedFesta };
