# IYRA — Performance Rules

Priority: usability > performance > content > visuals > extra effects.

## Tiers (`src/config/quality.js`)
| tier | DPR | ambient particles | text particle density | postprocessing | glass |
|---|---|---|---|---|---|
| high | 1–1.5 | 1800 | fine | bloom + noise + vignette | transmission |
| medium | 1–1.25 | 900 | medium | bloom | no |
| low | 1 | 400 | coarse | none | no |
| fallback | — | — | — | DOM visuals, no canvas | — |

- Initial tier from `useDeviceCapability` (WebGL support, software renderer, cores, memory, touch/viewport, save-data).
- Drei `PerformanceMonitor` steps the tier down at runtime if frame rate drops.
- `?quality=high|medium|low|fallback` forces a tier for QA.

## Rules
- Procedural geometry first; GLB (Draco) only when a model is genuinely needed. No 4K/8K textures.
- Particles: one Points draw call per system, animation in the vertex shader.
- Hidden scenes are `visible = false`; scenes are code-split and loaded ahead of need.
- Profile before removing features: DPR → particles → draw calls → postprocessing → shader cost.
