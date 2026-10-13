// Single Vercel function for the whole Express API. vercel.json rewrites every /api/* URL here;
// Express still sees the original URL (e.g. /api/documents/<id>/confirm).
import app from '../server/index.js';

export const config = { api: { bodyParser: false } };
export default app;
