# Novaris Group — Website v2 (3D &amp; animated)

A bolder, more "tendance" take on the Novaris Group site, built around an
**interactive WebGL globe** (fitting the worldwide-IT positioning) plus modern
motion: aurora gradient backdrop, custom cursor, magnetic buttons, 3D tilt
"bento" cards, an infinite logo marquee, scroll-driven reveals and animated
counters.

Still **dependency-light**: plain HTML/CSS/JS. The only external piece is
Three.js, loaded from a CDN at runtime — and the page **degrades gracefully**
(static glow + no fancy cursor) if WebGL or the CDN is unavailable, or if the
visitor prefers reduced motion.

## Files
```
novaris-group-website-v2/
├── index.html      # content & structure
├── styles.css      # design system, glass/bento, responsive, motion
├── scene.js        # Three.js particle globe + orbiting arcs (+ fallback)
├── script.js       # cursor, magnetic, tilt, reveals, counters, nav, form
├── assets/favicon.svg
└── README.md
```

## Run locally
```bash
cd novaris-group-website-v2
python3 -m http.server 8000   # then open http://localhost:8000
```
> Open via a local server (not `file://`) so the Three.js CDN script and fonts
> load reliably. An internet connection is needed for the 3D globe; without it
> you'll see the styled fallback background.

## What's different from v1
| | v1 | v2 |
|---|---|---|
| Hero | static gradient + grid | **interactive 3D particle globe** with orbiting data arcs |
| Motion | scroll reveals | reveals + **custom cursor, magnetic buttons, 3D tilt, marquee** |
| Services | 3-col card grid | **bento grid** with mouse-follow glow |
| Palette | cyan/indigo | **violet → indigo → cyan aurora** + film grain |
| Type | Sora / Inter | **Space Grotesk** / Inter |

## Customize
- **Colors / fonts** — `:root` in `styles.css` (`--c1..--c4`, `--grad`).
- **Globe density / speed / colors** — top of `scene.js` (`COUNT`, `ARC_N`, `cA`/`cB`, rotation in `tick()`).
- **Content** (services, track record, founder, contact) — `index.html`.

## Before going live
- **Contact form** validates + confirms but does not send — wire it to Formspree /
  Web3Forms / Netlify Forms or your endpoint in `script.js`.
- **Founder photo** uses an "AP" monogram — swap for a headshot.
- **Contact email** is `arnaud@pinnovations.io` — change if you prefer a Novaris address.
- For full offline support you can self-host Three.js: download `three.min.js`
  into `assets/` and update the `<script src>` in `index.html`.

## Deploy
Any static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages.
