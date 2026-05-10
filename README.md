# AI News Web

React (Vite) client for the **AI News Aggregator** API: sign up, log in, view recent news, and toggle email digest subscription. It expects the backend in `../ai-news-aggregater` to be running for full functionality.

## Requirements

- **Node.js** 18+ (20+ recommended)
- **npm** (or another client that respects `package-lock.json`)

## Quick start

Install dependencies (first time only):

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app defaults to [http://localhost:5173](http://localhost:5173). In dev, Vite proxies requests under `/api` to `http://127.0.0.1:8000`, so you normally **do not** need `VITE_API_URL` while the API listens on port 8000.

Start the API from the backend project (see `../ai-news-aggregater/README.md`), for example:

```bash
cd ../ai-news-aggregater
uv run uvicorn ai_news_aggregater.api.main:app --host 0.0.0.0 --port 8000
```

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Optional. Base URL for the API (no trailing slash). If unset, the app uses same-origin paths like `/api/v1/...` (works with the Vite dev proxy or when the UI is served behind the same host as the API). |

Example for a deployed API on another origin:

```bash
VITE_API_URL=https://api.example.com
```

The backend must list your UI origin in **`CORS_ORIGINS`** when the browser calls the API directly (not via proxy).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |

## App routes

| Path | Description |
|------|-------------|
| `/login` | Sign in |
| `/signup` | Create an account |
| `/dashboard` | Profile, digest toggle, recent news (requires auth) |

Unauthenticated visitors are redirected to `/login`; logged-in users hitting `/login` or `/signup` go to `/dashboard`.

## License

MIT (same as the monorepo / backend unless noted otherwise).
