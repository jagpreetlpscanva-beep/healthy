// Vercel catch-all serverless function for the existing Express API.
// Keep the raw request stream available so multer can parse multipart uploads.
import app from '../server/index.js';

export const config = { api: { bodyParser: false } };
export default app;
