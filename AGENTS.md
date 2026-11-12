# AGENTS.md: rules for AI agents working on this repo

This is **Usman Amer's personal website**: a static, whiteboard-style portfolio for an Upwork business developer and GTM specialist. There is **no framework, no build step and no dependencies**. Plain HTML, CSS and JavaScript.

## Project map

Real pages (Vercel `cleanUrls` serves `about.html` at `/about`):

| File | URL | Page |
|---|---|---|
| `index.html` | `/` | Home |
| `about.html` | `/about` | About, journey, education, resume download |
| `services.html` | `/services` | Services, process, pipeline calculator, FAQ |
| `work.html` | `/work` | Clients closed, tools |
| `gtm-lab.html` | `/gtm-lab` | Agentic Force demo, Umeed, six layers, client LinkedIn, games. `/gtm-lab?run=1` auto-runs the agents. |
| `contact.html` | `/contact` | Booking, contact details, message form |
| `blog/index.html` | `/blog` | Blog list |
| `blog/<slug>.html` | `/blog/<slug>` | Articles |

Shared files: `css/styles.css` (all styling, tokens at the top), `js/config.js` (owner settings: `bookingUrl`, `email`, `popupDelayMs`), `js/main.js` (nav, popup, copy buttons, calculator, games, GTM Lab; each feature only runs if its element is on the page), `sitemap.xml`, `robots.txt`, `vercel.json`, `assets/` (images, favicon, `og-image.jpg`, `Usman-Amer-Resume.pdf`).

**The header, footer, booking popup and `<head>` are repeated in every HTML file.** A change to the nav, footer or popup must be made in all 10 pages.

## Rules

1. **Keep it static.** Do not add React, Next.js, Tailwind, npm packages or a build step. The site must keep working by opening `index.html` directly.
2. **Never change the visual identity.** Fonts are Bricolage Grotesque (display), Geist (body), Kalam (handwriting), JetBrains Mono (labels). Colors come from CSS tokens only, such as `var(--ink)` and `var(--m-blue)`. Do not hard-code new colors in components.
3. **Both themes must work.** Any new color token goes in `:root` AND in both dark-mode blocks (`@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`).
4. **Buttons are `type="button"` with click handlers.** Never rely on a form `submit` to trigger logic (sandboxed previews block form submits).
5. **Navigation uses real pages.** Links are `/`, `/about`, `/services`, `/work`, `/gtm-lab`, `/contact`, `/blog`. Each `<body>` has `data-page="..."`, and `js/main.js` marks the matching `[data-nav]` link as current. Old `/#about`-style links redirect to the real page.
   - `/gtm-lab?run=1` opens the GTM Lab and auto-runs the agents.
   - `/gtm-lab#presence` jumps to the client LinkedIn profile.
   - `data-book` on any button opens the booking popup.
   - A new page needs: its own HTML file with the shared head/header/footer/popup, a nav link in every page (desktop nav, mobile menu, footer), and an entry in `sitemap.xml`.
6. **Mobile first-class.** Check every change at 390px wide. No horizontal page scroll. Grids collapse in the `@media (max-width:1060px)`, `(max-width:860px)` and `(max-width:600px)` blocks at the end of `styles.css`.
7. **SEO basics on every page.** One `<h1>` per page. Unique `<title>`, meta description, canonical, `og:url`, `og:title`, `og:description`. Links are root-absolute (`/about`, `/assets/...`). Add every new page to `sitemap.xml`. Home and About carry Person JSON-LD; blog posts carry BlogPosting JSON-LD.
8. **Honest content only.** Do not invent clients, numbers, testimonials or results. GTM Lab figures are labeled as estimates and example leads, so keep those labels.
9. **Privacy.** Do not add the owner's city or country anywhere on the site.
10. **Copy style.** Short, direct sentences. Active voice. No em-dash asides, no buzzword filler.
11. **Theme toggle.** `#theme-btn` in the navbar switches `data-theme` on `<html>` and saves it to `localStorage` key `ua_theme`. An inline script in `<head>` applies it before paint. Keep both.
12. **Binary files (images, PNG, JPG) must be committed with plain `git` from the terminal.** The GitHub MCP cannot upload binary files. Never replace images with base64 loader scripts.

## Facts about the owner (source of truth)

- Usman Amer: Upwork BD + GTM, learning technical sales closing.
- **Now:** Business Development Representative, Brown Tech International (Sep 2025 – Present).
- Business Developer, Leaptly (Jan 2026 – Sep 2026). Sales Executive, Growlatics (Nov 2024 – Aug 2025).
- GTM Engineer, Umeed (May 2026 – Jul 2026): ran his automations for them on email, Reddit, Instagram and LinkedIn. https://www.linkedin.com/company/umeed-reframing-mindsets/
- Core services: Upwork bidding, Upwork profile optimization, GTM automation (Agentic Force). Also LinkedIn profile optimization; learning technical sales closing.
- Upwork leads are found manually (Upwork has no API and does not allow scraping). Automated lead finding uses LinkedIn Sales Navigator, Apollo, Reddit and Instagram.
- Clients closed: TeleMD Health, VoiceCake, MPM Associates, Dr. Will Cole (GHL concierge), a water filtration project. LinkedIn client: Muhammad Uzair (7,184 followers).
- Email osmanb4u2@gmail.com · LinkedIn https://linkedin.com/in/usman-amer-a11652266

## Before you commit

- Preview with `npx serve .` (it supports clean URLs; opening the file directly breaks `/about` style links). Click every nav link, "Watch my GTM agents run", "Run Agentic Force", both games and the "Book a call" button.
- Check the browser console has no errors.
- Check at 390px and 1280px wide, in light and dark mode.
- Write a clear commit message and push to `main`. Vercel deploys automatically.

## Skills

Step-by-step workflows live in `.agents/skills/`:
- `edit-website`: change text, services, roles, clients, photo or settings.
- `deploy-website`: push to GitHub and deploy on Vercel, plus custom domain and Google Calendar setup.
