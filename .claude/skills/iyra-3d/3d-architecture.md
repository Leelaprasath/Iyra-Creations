# IYRA — 3D Architecture

## DOM vs WebGL
- DOM: navigation, all headings/copy, buttons, forms, SEO, accessibility.
- WebGL: atmosphere, storytelling objects, particles, light, transitions.
- Nothing essential exists only in the canvas.

## One persistent canvas
- `src/3d/core/Experience.jsx` mounts a single fixed `<Canvas>` behind the DOM.
- It is lazy-loaded so the DOM paints first; the `fallback` tier never loads it.
- `frameloop="never"`; the GSAP ticker calls `advance(timeSeconds)` — one RAF for Lenis, ScrollTrigger and R3F.

## Scroll bridge
- `src/scroll/tracker.js` measures every `[data-scene]` section (on ScrollTrigger refresh / resize) and, each tick, computes:
  - `journey` — continuous scene index (plateaus while a sticky chapter is pinned, transitions over one viewport between chapters)
  - per-section `pin` (0..1 while sticky) and `view` (0..1 while on screen)
- 3D reads it in `useFrame` (no React renders). DOM consumers use `subscribe(id, cb)` and write to the DOM directly.

## World layout
- Scenes sit at fixed world positions (`src/config/scenes.js`) along a descending path.
- `CameraController` interpolates between per-scene camera keyframes using `journey`, adds damped pointer parallax (off for reduced motion / touch) and the intro pull-back.
- Scene layout offsets differ for desktop (object beside text) and mobile (object above text).

## Scene lifecycle
- `SceneManager` lazy-loads a scene when `|journey - index| <= 2` (preloads the next) and keeps it mounted; `SceneSlot` sets `visible = false` outside `|journey - index| < 1.25`.
- Each scene is wrapped in an error boundary: a scene failure removes only that scene.

## Folders
- `3d/core` canvas, manager, camera, lights, performance
- `3d/scenes` one file per story scene
- `3d/objects` reusable meshes (creation core, browser, dashboard…)
- `3d/particles` ParticleField, ParticleText (shader-driven BufferGeometry)
- `3d/effects` postprocessing
- `3d/shaders` GLSL strings

## Memory
- Geometries/materials created in `useMemo` are disposed in effect cleanups (R3F auto-disposes JSX-declared ones).
- CanvasTextures are disposed on unmount. No per-frame allocation.
