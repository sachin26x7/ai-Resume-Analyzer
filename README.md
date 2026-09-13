# AI Resume Analyzer

AI-powered ATS Resume Analysis & Career Recommendation System built with React + Node.js + MongoDB + Google Gemini.

---

## 🚀 Running Locally

### 1. Install dependencies

```bash
# From the project root — installs both client and server
npm run install:all
```

### 2. Configure environment variables

**Server** (`server/.env`):
```bash
cp server/.env.example server/.env
# Fill in GEMINI_API_KEY and MONGODB_URI
```

**Client** (`client/.env.local`):
```bash
# Already created — points to http://localhost:5000
# Edit client/.env.local if your server runs on a different port
```

### 3. Start both server and client

```bash
# From the project root — runs both in one terminal
npm run dev
```

Or separately:
```bash
npm run dev:server   # starts backend on http://localhost:5000
npm run dev:client   # starts frontend on http://localhost:5173
```

---

## ☁️ Deploying

### Backend → Render

1. Push this repo to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo, set **Root Directory** to `server`
4. Set these environment variables in Render Dashboard → **Environment**:
   - `GEMINI_API_KEY` — your Google Gemini API key
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `CLIENT_URL` — your Netlify frontend URL (e.g. `https://your-site.netlify.app`)
5. Deploy! Render reads `render.yaml` automatically.

### Frontend → Netlify

1. Create a new **Site** on [Netlify](https://netlify.com), connect your GitHub repo
2. Netlify reads `netlify.toml` automatically:
   - Base dir: `client`
   - Build command: `npm ci && npm run build`
   - Publish dir: `dist`
3. The `VITE_API_URL` is already set in `netlify.toml` to point at your Render backend.
   - **Update it** if your Render service URL is different: Netlify Dashboard → Site Settings → Environment Variables → add `VITE_API_URL`
4. Deploy!

---

## 🔑 Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `VITE_API_URL` | client `.env.local` / Netlify | Backend API URL |
| `GEMINI_API_KEY` | server `.env` / Render | Google Gemini AI key |
| `MONGODB_URI` | server `.env` / Render | MongoDB Atlas URI |
| `CLIENT_URL` | server `.env` / Render | Frontend URL (for CORS) |
| `PORT` | server `.env` | Server port (default: 5000) |

---

## 🗂️ Project Structure

```
ai-resume-analysier/
├── client/                  # React + Vite frontend
│   ├── .env.local           # Local dev env (gitignored)
│   ├── .env.production      # Production env (safe to commit)
│   ├── .env.example         # Template for new contributors
│   └── src/
│       ├── components/
│       └── services/api.js
├── server/                  # Express + Node.js backend
│   ├── .env                 # Local secrets (gitignored)
│   ├── .env.example         # Template for new contributors
│   └── src/
│       ├── models/
│       ├── nlp/
│       └── routes/
├── netlify.toml             # Netlify deployment config
├── render.yaml              # Render deployment config
└── package.json             # Root scripts (npm run dev)
```
