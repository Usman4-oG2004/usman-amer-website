# Usman Amer: website

A whiteboard-style portfolio with six pages (Home, About, Services, Work, GTM Lab, Contact), a booking popup, two sales games, the Agentic Force GTM demo and a scrollable client LinkedIn profile.

## Folder

```
usman-amer-website/
├── index.html                 all page content
├── css/styles.css             design, colors, dark mode, mobile layout
├── js/config.js               YOUR SETTINGS (booking link, email, popup timing)
├── js/main.js                 page logic: navigation, popup, games, GTM Lab
├── assets/favicon.svg         browser tab icon
├── assets/images/             your photo and the client profile screenshot
└── robots.txt
```

## 1. Connect Google Calendar + Google Meet

1. Open Google Calendar on a computer and click **Create → Appointment schedule**.
2. Set the length (15 min) and your available hours.
3. Under location / conferencing, choose **Google Meet** so every booking gets a Meet link.
4. Save, click **Share → Website embed → Inline**, and copy the URL inside the code
   (it starts with `https://calendar.google.com/calendar/appointments/schedules/`).
5. Paste it into `js/config.js`:

```js
bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/XXXX",
```

Now the popup's **Pick a time** button opens your booking page, the Contact page shows your live calendar, and every booking lands in your calendar with a Meet link.

## 2. Deploy

- **Netlify (fastest):** go to https://app.netlify.com/drop and drag the whole `usman-amer-website` folder in.
- **Vercel:** create a new project, upload the folder, no build settings needed.
- **GitHub Pages:** push the folder to a repository, then Settings → Pages → deploy from the main branch.
- **Custom domain:** add it in your host's domain settings after deploying.

## 3. Common edits

- **Text:** edit `index.html`. Each page is a block that starts with a comment like `<!-- ===== ABOUT ===== -->`.
- **Photo:** replace `assets/images/usman-amer.jpg` with a square image of the same name.
- **Add a client profile:** export their LinkedIn page as a screenshot, save it in `assets/images/`, and copy the `<figure class="browser">` block in the GTM Lab section.
- **Colors:** the palette is at the top of `css/styles.css` (`:root` for light mode, the blocks under it for dark mode).

No build step and no dependencies. Open `index.html` in a browser to preview it locally.
