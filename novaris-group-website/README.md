# Novaris Group — Website

A self-contained, responsive marketing website for **Novaris Group**, a Bulgaria-based
IT consulting firm offering enterprise IT services worldwide and placing IT consultants
with client companies.

Dark, modern agency aesthetic with electric-blue accents. No build step, no dependencies —
just open it in a browser or host the folder anywhere.

## Files

```
novaris-group-website/
├── index.html        # All page content & structure
├── styles.css        # Design system & responsive layout
├── script.js         # Nav, scroll reveals, animated counters, contact form
├── assets/
│   └── favicon.svg   # Logo / favicon
└── README.md
```

## Run locally

Just open `index.html` in your browser, or serve the folder:

```bash
cd novaris-group-website
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Sections

- **Hero** — positioning + animated key stats
- **Trust bar** — organizations where the experience was earned
- **Services** — IT Consulting & Staffing, Infrastructure & AD, Cloud & DevOps,
  Cybersecurity & Identity, AI & Automation, Software & Web Development
- **Why Novaris** — six differentiators
- **Approach** — Discover → Design → Deliver → Sustain
- **Experience** — timeline of real roles (European Commission, Société Générale CIB,
  Hydro-Québec, Aéroports de Montréal, Council of the EU, founder/CTO ventures)
- **Leadership** — Arnaud Piraprez bio & credentials
- **Contact** — info + form

## Customize

| What | Where |
|------|-------|
| Company name / nav | `index.html` header (`.brand-text`) |
| Headline & sub-copy | `.hero` section in `index.html` |
| Services | `#services` cards in `index.html` |
| Experience entries | `#experience` `.timeline` in `index.html` |
| Bio & credentials | `#leadership` section in `index.html` |
| Contact email / LinkedIn | `#contact` + footer in `index.html` |
| Colors / fonts | `:root` variables at the top of `styles.css` |

### Things to update before going live

- **Contact email** — currently `arnaud@pinnovations.io`; change to a Novaris Group address if you prefer.
- **Contact form** — it validates and shows a confirmation but does **not** send anything yet.
  Wire it to a form service (Formspree, Web3Forms, Netlify Forms) or your own endpoint in `script.js`.
- **Photo** — the leadership section uses an "AP" monogram placeholder. Drop a headshot into
  `assets/` and replace `.photo-frame` markup with an `<img>` for a personal touch.
- **Legal** — add Privacy Policy / company registration details (Bulgarian entity) in the footer when ready.

## Deploy

Any static host works: **GitHub Pages**, **Netlify**, **Vercel**, **Cloudflare Pages**,
or any web server. Upload the folder contents to your domain root.
