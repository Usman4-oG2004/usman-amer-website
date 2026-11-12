---
name: edit-website
description: Use when changing anything on Usman Amer's website, including text, services, job roles, clients, the photo, the booking link or adding a client LinkedIn profile. Covers where each piece lives and how to change it without breaking the design.
---

# Edit the website

Read `AGENTS.md` first. Everything is plain HTML/CSS/JS, so edit the files directly.

## Common changes

### Booking link (Google Calendar + Meet)
Edit `js/config.js` → `bookingUrl`. Use the long link from Google Calendar → Appointment schedule → Share → Website embed → Inline (the URL inside the iframe code, starting `https://calendar.google.com/calendar/appointments/schedules/`). With `embedCalendar: true` the Contact page shows the live calendar.

### Text on a page
Each page is its own file: `index.html`, `about.html`, `services.html`, `work.html`, `gtm-lab.html`, `contact.html`, `blog/`. Edit text in place and keep the existing classes. The nav, footer and popup are repeated in every file: change them everywhere.

### New blog post
Copy an existing `blog/<slug>.html`, change the `<title>`, description, canonical, og tags, JSON-LD (headline, description, dates, url), the `<h1>` and the article body. Add a card for it in `blog/index.html` and on the home page, and add its URL to `sitemap.xml`.

### Services (Services page)
Cards are `<article class="svc">` inside `<div class="services">`.
- Core service: `class="svc core"` with `<span class="core-tag">Core</span>`.
- Learning skill: `class="svc wide learn"` with `<span class="learn-tag">Learning now</span>`.
- The grid uses 6 columns: normal cards span 2, `wide` cards span 3. Keep rows full (3 normal, or 2 wide).

### Current job (About page spotlight)
The `<div class="whiteboard now">` block. Update title, company (`now-co`), dates (`now-when`) and the four `now-list` items.

### Past roles (About page journey)
`<div class="route">` holds `<div class="stop">` index cards in date order. The last card (`stop next`) is "Technical closer". Keep 4 cards per row on desktop.

### Clients closed (Work page)
`<div class="cases">` holds sticky-note cards. Keep 6 (3 per row) or 3.

### Add a client LinkedIn profile (GTM Lab page)
1. Save a full-page screenshot as `assets/images/client-NAME-linkedin.jpg` (crop to the main profile column, about 800px wide).
2. In `index.html`, copy the `<figure class="browser">` block in `<section id="presence">` and update the image path, alt text, URL bar text and side details.
3. Only state results the client actually got.

### Owner photo
Replace `assets/images/usman-amer.jpg` with a square image of the same name.

### Colors or fonts
Change tokens at the top of `css/styles.css`. Update light `:root` and both dark blocks.

## Check before committing
- Click through every page, the GTM Lab run button, both games and the popup.
- 390px and 1280px widths, light and dark mode, no console errors.
