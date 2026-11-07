# AGENTS.md: rules for AI agents working on this repo

This is **Usman Amer's personal website**: a static, whiteboard-style portfolio for an Upwork business developer and GTM specialist. There is **no framework, no build step and no dependencies**. Plain HTML, CSS and JavaScript.

## Project map

| File | What it holds |
|---|---|
| `index.html` | All content for the 6 pages: Home, About, Services, Work, GTM Lab, Contact. Each page is a `<div class="view" id="v-NAME" data-view="NAME">` block. |
| `css/styles.css` | All styling. Color and font tokens are at the top in `:root`; dark mode redefines the same tokens below it. |
| `js/config.js` | Owner settings: `bookingUrl`, `embedCalendar`, `email`, `popupDelayMs`. **The only file the owner normally edits.** |
| `js/main.js` | Page logic: hash router, booking popup, copy buttons, draggable notes, pipeline calculator, message form, two games, GTM Lab (Agentic Force demo + sales-agent chat). |
| `assets/images/` | `usman-amer.jpg` (owner photo), `client-muhammad-uzair-linkedin.jpg` (client profile screenshot). |
| `vercel.json` | Hosting headers for Vercel. |

## Rules

1. **Keep it static.** Do not add React, Next.js, Tailwind, npm packages or a build step. The site must keep working by opening `index.html` directly.
2. **Never change the visual identity.** Fonts are Bricolage Grotesque (display), Geist (body), Kalam (handwriting), JetBrains Mono (labels). Colors come from CSS tokens only, such as `var(--ink)` and `var(--m-blue)`. Do not hard-code new colors in components.
3. **Both themes must work.** Any new color token goes in `:root` AND in both dark-mode blocks (`@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`).
4. **Buttons are `type="button"` with click handlers.** Never rely on a form `submit` to trigger logic (sandboxed previews block form submits).
5. **Navigation is hash-based.** Page links are `<a href="#about">` etc. Valid views: `home, about, services, work, lab, contact`. Extra attributes:
   - `data-run` on a link to `#lab` opens the GTM Lab and auto-runs the agents.
   - `data-scroll="presence"` opens the page and scrolls to that element id.
   - `data-book` on any button opens the booking popup.
   - New pages need: a `v-NAME` view block, an entry in the `VIEWS` array in `js/main.js`, and nav links in the desktop nav, mobile menu and footer.
6. **Mobile first-class.** Check every change at 390px wide. No horizontal page scroll. Grids collapse in the `@media (max-width:1060px)`, `(max-width:860px)` and `(max-width:600px)` blocks at the end of `styles.css`.
7. **Honest content only.** Do not invent clients, numbers, testimonials or results. GTM Lab figures are labeled as estimates and example leads, so keep those labels.
8. **Privacy.** Do not add the owner's city or country anywhere on the site.
9. **Copy style.** Short, direct sentences. Active voice. No em-dash asides, no buzzword filler.
10. **Theme toggle.** `#theme-btn` in the navbar switches `data-theme` on `<html>` and saves it to `localStorage` key `ua_theme`. An inline script in `<head>` applies it before paint. Keep both.
11. **Binary files (images, PNG, JPG) must be committed with plain `git` from the terminal.** The GitHub MCP cannot upload binary files. Never replace images with base64 loader scripts.

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

- Open `index.html` in a browser and click every nav link, "Watch my GTM agents run", "Run Agentic Force", both games and the "Book a call" button.
- Check the browser console has no errors.
- Check at 390px and 1280px wide, in light and dark mode.
- Write a clear commit message and push to `main`. Vercel deploys automatically.

## Skills

Step-by-step workflows live in `.agents/skills/`:
- `edit-website`: change text, services, roles, clients, photo or settings.
- `deploy-website`: push to GitHub and deploy on Vercel, plus custom domain and Google Calendar setup.
