# MediMind Vercel + OpenAI fix

## What this fixes
- Adds a dedicated `/api/health` Vercel function that always returns JSON.
- Removes the catch-all SPA rewrite that could make API URLs return `index.html`.
- Keeps the Express API catch-all for `/api/profile`, document upload/confirm/delete, ABHA and FHIR routes.
- Switches extraction to OpenAI (`OPENAI_API_KEY`, default model `gpt-4o-mini`).
- Starts with an empty dashboard. Sample data is only loaded when the user clicks **Try with a sample report**.

## Deploy
1. Replace the existing project files with the contents of this project (or copy the changed files while preserving paths).
2. In the project root, run `npm install` and commit the updated `package-lock.json` that npm generates.
3. In Vercel → Project → Settings → Environment Variables, set `OPENAI_API_KEY` to your key and `OPENAI_MODEL` to `gpt-4o-mini`.
4. Redeploy the latest commit.
5. Open `https://YOUR-DEPLOYMENT.vercel.app/api/health`. It must show JSON like `{"ok":true,"service":"medimind-api","ai":true,"model":"gpt-4o-mini",...}`. If it shows the website HTML, Vercel is not deploying the updated project root/configuration.
6. Open `/api/profile`. It must return JSON with `documents`, `tests`, `meds`, `dx`, `events`, `abha`, and `ai`.

## Important
- Do not commit the real API key. Add it only in Vercel Environment Variables.
- `server/store.js` uses local JSON files. Vercel serverless local storage is ephemeral, so this prototype does not provide durable production data storage. Connect a database before storing real health records.
