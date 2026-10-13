// Dedicated Vercel health endpoint. Always returns JSON, never the SPA HTML.
export default function handler(_req, res) {
  const ai = Boolean(process.env.OPENAI_API_KEY);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    ok: true,
    service: 'medimind-api',
    ai,
    model: ai ? (process.env.OPENAI_MODEL || 'gpt-4o-mini') : null,
    message: ai ? 'Backend and OpenAI configuration detected' : 'Backend is running; OPENAI_API_KEY is not configured'
  });
}
