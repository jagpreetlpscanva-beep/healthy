// Dedicated Vercel route for profile GET/PUT so profile requests do not depend
// on catch-all route resolution. Keep the shared Express handlers as source of truth.
import app from '../server/index.js';

export const config = { api: { bodyParser: false } };
export default app;
