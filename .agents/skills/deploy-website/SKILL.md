---
name: deploy-website
description: Use when publishing Usman Amer's website. Push it to GitHub, deploy it on Vercel (recommended) or Render, connect a custom domain, or set up the Google Calendar booking link.
---

# Deploy the website

The site is static: no build command, output directory is the repo root.

## 1. Push to GitHub
1. Create a repository (e.g. `usman-amer-website`). Public or private both work.
2. Commit everything in this folder, including `.agents/`, `AGENTS.md` and `vercel.json`, to the `main` branch.

## 2. Deploy on Vercel (recommended)
1. vercel.com → Add New → Project → Import the GitHub repo.
2. Framework preset: **Other**. Build command: **empty**. Output directory: **./** (root). Install command: empty.
3. Deploy. Every push to `main` redeploys automatically; pull requests get preview links.

### Alternative: Render
1. render.com → New → **Static Site** → connect the repo.
2. Build command: empty (or `echo done`). Publish directory: `.`
3. Create. Static sites on Render are free and don't sleep.

## 3. Custom domain
Vercel → Project → Settings → Domains → add the domain, then add the DNS records Vercel shows at the domain registrar. HTTPS is automatic.

## 4. Google Calendar booking + Google Meet
1. Google Calendar → Create → **Appointment schedule**. Set 15 min, availability, and Google Meet as the location.
2. Save → Share → **Website embed → Inline** → copy the URL inside the code.
3. Paste into `js/config.js` → `bookingUrl`, commit, push. Vercel redeploys.

## After deploying
Open the live URL and check: nav links, "Watch my GTM agents run", popup "Pick a time" opens the calendar, Contact page shows the calendar, mobile layout.
