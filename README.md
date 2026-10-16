# Jesus The Authentic Solution Ministry — Solution Ground

Official website frontend for **Jesus The Authentic Solution Ministry** (also known as **Solution Ground**).

Built with **HTML5, CSS3, and vanilla JavaScript only** — no frameworks, no build step, no dependencies.

---

## File structure

```
.
├── index.html          # All page content (single-page site)
├── css/
│   └── style.css       # Full design system + responsive styles
├── js/
│   └── script.js       # Navigation, animations, forms, utilities
├── images/             # Photos + SVG placeholder images
│   ├── logo.jpg            # Official ministry logo (nav, footer, welcome)
│   ├── pastor-echebiri.jpg # Portrait of the General Overseer
│   ├── service-1.jpg, service-2.jpg # Service-in-session photos (Join Us section)
│   ├── hero.svg
│   ├── sermon-1.svg … sermon-3.svg
│   ├── event-1.svg, event-2.svg
│   └── map-hq.svg, map-oshodi.svg
└── README.md
```

## How to run

No build required. Open `index.html` directly in a browser, **or** serve locally for best results:

```bash
# Python 3
python -m http.server 8000
# then visit http://localhost:8000
```

```bash
# Node (if installed)
npx serve .
```

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses `clamp()`, CSS custom properties, `IntersectionObserver`, and `scroll-behavior` — all supported in current browsers.

---

## Editing guide for church administrators

Every piece of information that still needs to be provided is either:

1. Wrapped in **square brackets**, e.g. `[Service time to be provided]`, or
2. Marked with an **HTML comment** starting with `EDIT:` inside `index.html`.

### Placeholders to replace (search `index.html` for `[`)

| Section | What to replace |
|---|---|
| **Services (`#services`)** | `[Service time to be provided]`, `[Schedule to be provided]` |
| **About (`#about`)** | `[Official ministry description…]`, mission, vision, values |
| **General Overseer (`#overseer`)** | `[Official biography to be provided]` |
| **Ministries (`#ministries`)** | Six placeholder department names + descriptions |
| **Sermons (`#sermons`)** | Sermon titles, `[Date]`, video/audio links |
| **Events (`#events`)** | `[Upcoming Church Program]`, `[Date]`, `[Time]`, `[Location]` |
| **Testimonies (`#testimonies`)** | `Member testimony will appear here.` + `[Member Name]` |
| **Giving (`#give`)** | `[Official giving information to be provided]` + list items |
| **Footer social icons** | `href="#"` links → real social URLs |

### Swapping images

Replace files in `images/` keeping the **same filenames** (or update the `src` in `index.html`):

- `logo.jpg` → ministry logo (nav, footer and welcome section, shown circular/rounded; keep it square)
- `pastor-echebiri.jpg` → portrait of Rev. Pastor J. Echebiri
- `service-1.jpg`, `service-2.jpg` → service-in-session photos in the Join Us section (shown at 16:9)
- `hero.svg` → hero background (recommended: ≥1920×1080, JPG/WebP)
- `sermon-*.svg` → sermon thumbnails (16:10 or 16:9)
- `event-*.svg` → event images (16:9)
- `map-*.svg` → map screenshots or embeds

Real photos can be `.jpg`, `.png`, or `.webp` — just update the `src` attribute.

### Adding Google Maps links

In each location card, replace the `href` on **GET DIRECTIONS**:

```html
<a class="btn btn--navy btn--sm"
   href="https://www.google.com/maps/search/?api=1&query=YOUR+MAPS+QUERY"
   target="_blank" rel="noopener noreferrer">GET DIRECTIONS</a>
```

To embed a map, replace the `<img>` inside `.location-card__map` with a Google Maps `<iframe>`.

### Adding a real sermon video

See the commented structure in `index.html` (sermons section) — paste the YouTube embed `<iframe>` in place of the card image, and point **WATCH MESSAGE** to the YouTube URL.

### Connecting the forms (important)

The prayer and contact forms currently do **client-side validation only**. The success message honestly tells visitors the message was **not** delivered yet.

To make forms actually send, connect a backend, for example:

- **Formspree / Basin / Getform** — change the form's handling to POST to your endpoint
- **EmailJS** — send directly from the browser
- **Custom API** — point `fetch()` at your server

When a real backend is added, update the success messages in `js/script.js` (`successMsg` strings) so they say the message was sent.

---

## Design system quick reference

Colors (CSS variables in `css/style.css` → `:root`):

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0B1F3A` | Primary/dominant brand color |
| `--royal` | `#164E8A` | Secondary blue |
| `--gold` | `#C9A227` | Accent — buttons, icons, highlights |
| `--white` | `#FFFFFF` | Backgrounds, light text on dark |
| `--off-white` | `#F7F8FA` | Alternate section backgrounds |
| `--ink` | `#172033` | Body text |
| `--muted` | `#667085` | Secondary text |

Fonts: **Montserrat** (headings) + **Inter** (body), loaded from Google Fonts with system fallbacks.

---

## Accessibility notes

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Skip-to-content link, visible focus rings, ARIA on the menu and forms
- All images have alt text; decorative SVGs are `aria-hidden`
- Forms use real `<label>` elements and live error regions (`role="alert"`)
- Respects `prefers-reduced-motion`

## License / copyright

© 2026 Jesus The Authentic Solution Ministry. All Rights Reserved.
