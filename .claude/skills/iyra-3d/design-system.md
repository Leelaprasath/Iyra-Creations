# IYRA — Design System

## Colour (`src/styles/tokens.css`)
- `--c-orange #DB622B` accent only (CTAs, focus, active states, light)
- `--c-black #000000`, `--c-white #FFFFFF`
- Neutrals: `#0A0A0A #111111 #181818` surfaces, `#EAEAEA` primary text on dark, `#A1A1A1` secondary text
- Never make large surfaces orange except the final CTA moment.

## Type
- Inter Variable (self-hosted via @fontsource-variable). Display 700–800, tight tracking (-0.04em), uppercase statements.
- Scale: display `clamp(3rem, 11vw, 11rem)`, h2 `clamp(2.5rem, 7vw, 7rem)`, body 1rem–1.125rem, labels 0.75rem uppercase +0.2em tracking.
- Short statements, big negative space, no long paragraphs.

## Layout
- 12-col feel via `--gutter: clamp(1rem, 4vw, 3rem)`; content max 1440px.
- Section labels: `01 — WEBSITE DEVELOPMENT` style mono-rhythm indexes.

## Components
- Buttons: pill-less, square-edged outline/solid; primary = orange fill, magnetic on key CTAs only.
- Focus ring: 2px orange outline + 3px offset.
- No card grids, no stock imagery, no decorative icons.
