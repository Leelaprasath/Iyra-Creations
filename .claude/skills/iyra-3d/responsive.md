# IYRA — Responsive Rules

Breakpoints (`src/config/breakpoints.js`): mobile < 768, tablet 768–1023, desktop ≥ 1024.

- Desktop: full scene set, object beside text, pointer parallax, custom cursor.
- Tablet: medium tier by default, reduced camera moves.
- Mobile: dedicated layout — object above text in sticky chapters, low/medium tier, no pointer parallax, no cursor, work gallery becomes a vertical list, shorter chapter heights.
- Test widths: 320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920. No horizontal overflow at any width.
- Fluid type with `clamp()`; minimum 16px body text; touch targets ≥ 44px.
- Use `svh`/`dvh` for full-height sections to avoid mobile browser chrome jumps.
