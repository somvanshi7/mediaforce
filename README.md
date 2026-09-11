# Media Force Bewitch You

*"May the Force be with you."* Somvanshi's own movie & web series collection
tracker. Runs on your machine or in the cloud — PIN-protected, accessible
from your phone anywhere.

## What's in your collection right now

870+ titles across 19 categories — 705 movies, 167 series, 251 tagged
Indian — plus whatever you've added yourself since.

## Running it locally

1. Open this folder in VS Code: **File → Open Folder**.
2. Open a terminal inside VS Code: **Terminal → New Terminal**.
3. Install dependencies (only needed once, or after this update):
   ```
   npm install
   ```
4. Start the app:
   ```
   npm start
   ```
5. Open your browser to **http://localhost:3000**

For development with auto-restart on file changes:
```
npm run dev
```

## PIN Protection

When deployed (or when testing locally), set the `APP_PIN` environment
variable to lock the app behind a PIN:

```bash
# Windows (PowerShell)
$env:APP_PIN="136479"; npm start

# Linux / Mac
APP_PIN=136479 npm start
```

When `APP_PIN` is not set, the app runs in open mode (no login required) —
perfect for local development.

## Deploying to Render (access from phone)

1. Push this folder to a **private GitHub repo**:
   ```
   git init
   git add .
   git commit -m "MediaForce v2"
   git remote add origin <your-private-repo-url>
   git push -u origin main
   ```

2. Go to [render.com](https://render.com) and sign up (free).

3. Click **New → Web Service** → connect your GitHub repo.

4. Render will auto-detect the `render.yaml` blueprint. Confirm and deploy.

5. In the Render dashboard, go to **Environment** and set:
   - `APP_PIN` = your PIN (e.g. `136479`)

6. Your app will be live at `https://mediaforce-xxxx.onrender.com`

**Free tier note:** The free tier spins down after 15 minutes of inactivity.
First load after sleep takes ~30 seconds. Paid plan ($7/mo) keeps it
always-on.

## Install as a Phone App

Once deployed, open the URL on your phone and tap:
- **Android (Chrome):** Menu → "Add to Home Screen"
- **iPhone (Safari):** Share → "Add to Home Screen"

It will install as a standalone app with the MediaForce icon.

## Where your data actually lives

Everything you add, edit, or delete is saved to one file:

```
data/collection.json
```

That file **is** your collection. Back it up any time with the **Export
Backup** button in the nav.

**To restore from a backup:** replace `data/collection.json` with your
saved backup file and restart the server.

## Features

- **Browse** — full collection grouped by category, each with its own
  icon, filterable by search text, category, movie/series, and
  Indian/International. Instant client-side search + sort toggles.
- **Watchlist** — a separate queue with time-ago labels; "Mark Watched"
  moves a title straight into your permanent collection.
- **Add Title** — log something you just watched, or queue something up.
  Category autocompletes. Quick-add FAB button on mobile.
- **Edit / Delete** — every title is fully editable.
- **Export Backup** — one-click download of your whole collection as JSON.
- **PIN Protection** — optional PIN lock for cloud deployment.
- **PWA** — installable as a phone app from the browser.
- **Toast Notifications** — visual feedback on every action.
- **Animated UI** — counters, staggered card animations, glassmorphism nav.

## Project structure

```
media-force-bewitch-you/
├── server.js                  — starts the app
├── db.js                      — reads/writes data/collection.json
├── middleware/auth.js         — PIN-based session auth
├── routes/collection.js       — all pages and actions
├── utils/categoryIcons.js     — maps each category to its icon
├── data/collection.json       — YOUR DATA — back this up
├── views/                     — pages (EJS templates)
│   ├── partials/              — head, nav, footer, icon SVGs
│   └── login.ejs              — PIN entry screen
├── public/
│   ├── css/style.css          — all styles
│   ├── js/app.js              — client-side interactivity
│   ├── sw.js                  — service worker (PWA)
│   └── manifest.json          — PWA manifest
├── render.yaml                — Render deployment blueprint
└── scripts/build-seed.js      — the one-time PDF import script
```
