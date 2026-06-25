import { stubModule } from './stub.js';

// Continuity: per-repo committed AI session memory (.compass/). Git is the system of
// record; the app reads/launches/standardizes and needs no store here.
export const continuityModule = stubModule('continuity');
