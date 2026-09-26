# IYRA Creations — website

Cinematic, interactive studio site for IYRA Creations: website development, SaaS products, logo design, complete branding and name reveal videos.

React 19 · Vite 8 · Three.js · React Three Fiber · Drei · GSAP (ScrollTrigger, SplitText) · Lenis · @react-three/postprocessing · Zustand

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # serve the production build
npm run lint      # ESLint
npm test          # Vitest unit tests
npm run format    # Prettier
npm run brand     # regenerate public/brand/*.svg and public/favicon.svg from src/brand/logo.js
```

## Configuration (`.env`, see `.env.example`)

| Variable                | Purpose                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL`         | Production URL. Enables canonical link, `og:url`, absolute OG image, `sitemap.xml` and a sitemap-aware `robots.txt` at build time. |
| `VITE_CONTACT_ENDPOINT` | Endpoint that accepts the contact form as a JSON `POST`. **Until set, the form does not send and says so** (no fake success).      |
| `VITE_CONTACT_EMAIL`    | Public address for "Say hello", the footer and the mailto fallback. Hidden everywhere when empty.                                  |

The contact integration lives in `src/services/contactAdapter.js`: swap the `fetch` for any provider there.

## Deployment

It is a single-page app with client routes (`/work/:slug`), so the host must serve `index.html` for unknown paths.

**Vercel** is preconfigured by `vercel.json` (Vite build → `dist/`, SPA rewrite, long-lived caching for hashed `/assets/*`, basic security headers). Import the repo in Vercel, then under _Settings → Environment Variables_ set `VITE_SITE_URL` (e.g. `https://iyracreations.com`, no trailing slash), `VITE_CONTACT_EMAIL` and, when ready, `VITE_CONTACT_ENDPOINT`. These are baked in at build time, so redeploy after changing them.

Other hosts: e.g. Netlify `/* /index.html 200`.

## Content to replace before launch

- **Portfolio** — `src/data/projects.js` holds four _IYRA concept studies_, labelled as concepts everywhere they appear. Replace/add real case studies (same shape; `concept: false`).
- **Logo** — `src/brand/logo.js` is a vector redraw of the supplied logo. If an official SVG exists, drop its paths in and run `npm run brand`.
- **Budget bands** — `src/data/contact.js` (currency and ranges).
- **Social links** — `src/data/socialLinks.js` (the footer hides the list while empty).
- **OG image** — `public/og-image.png` (1200 × 630).

## Architecture

```
DOM (all content, SEO, a11y)            WebGL (one persistent canvas, decorative)
  sections/*  ──[data-scene]──┐          3d/core/Experience  (lazy chunk)
  StickyChapter / stage rails │           ├ FrameDriver   GSAP ticker → R3F advance()
                              ▼           ├ CameraController  keyframes + lens shift
               runtime/tracker (scroll journey, per-section pin/view)
                              ▲           ├ SceneManager  lazy scenes, precompiled
  runtime/smoothScroll: GSAP ticker → Lenis → tracker → WebGL  (one RAF)
```

- **One loop**: GSAP's ticker drives Lenis, ScrollTrigger, the scroll tracker and the renderer (`frameloop="never"`).
- **Scroll → 3D**: `runtime/tracker.js` measures `[data-scene]` sections and exposes a continuous _journey_ index plus per-section progress. Scenes read it in `useFrame`; DOM stage rails subscribe and write styles directly (no React re-renders per frame).
- **Scenes** (`src/3d/scenes`) sit along a vertical world path (`config/scenes.js`); each is code-split, fetched two sections early and shader-precompiled before it is visible.
- **Quality tiers** (`config/quality.js`): `high | medium | low | fallback`, chosen from device signals, stepped down at runtime by frame rate. `fallback` never downloads the WebGL chunk and shows DOM/SVG renditions of every scene. Force one with `?quality=low` etc.
- **Reduced motion**: no smooth scrolling, no parallax/idle motion, intro skipped, scroll scenes step between stages.
- **Name reveal engine**: `3d/objects/NameRevealExperience.jsx` — `<NameRevealExperience name subtitle accentColor style getProgress />`; add styles to its `STYLES` registry.
- **Analytics-ready**: `utils/analytics.js` dispatches `iyra:analytics` events (and pushes to `window.dataLayer` if a tag manager exists). No tracker is installed.

Project rules for contributors (and AI assistants) live in `.claude/skills/iyra-3d/`.

## QA notes

- `?debug` exposes `window.__iyra` (scroll tracker, renderer) for automated browser checks.
- Loading milestones are marked in DevTools Performance as `iyra:load:*`.
