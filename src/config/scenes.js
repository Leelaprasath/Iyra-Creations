/**
 * The WebGL journey. Order matches the DOM order of `[data-scene]` sections.
 *
 * - `camera`: camera position relative to the scene origin; it looks at `target`.
 * - `frame`: where the scene's object sits on screen, as a fraction of the
 *   viewport from centre ([x, y]; +x = right, +y = up). Applied as a lens shift
 *   so perspective stays natural. Desktop places objects beside the copy;
 *   tablet/mobile chapters stack the object in the top ~40% of the screen
 *   (see StickyChapter.module.css), i.e. ~0.29 above centre.
 */
export const SCENE_SPACING = 14

export const SCENES = [
  {
    id: 'hero',
    camera: [0, 0, 9],
    target: [0, 0, 0],
    frame: { desktop: [0.2, 0], tablet: [0.12, 0.08], mobile: [0, 0.2] },
  },
  {
    id: 'services',
    camera: [0, 0.4, 10],
    target: [0, 0, 0],
    frame: { desktop: [0.3, -0.06], tablet: [0.22, -0.1], mobile: [0.2, -0.22] },
  },
  {
    id: 'web',
    camera: [0.6, 0.3, 8.5],
    target: [0, 0, 0],
    frame: { desktop: [0.22, 0], tablet: [0, 0.29], mobile: [0, 0.29] },
  },
  {
    id: 'saas',
    camera: [-0.6, 0.3, 8.5],
    target: [0, 0, 0],
    frame: { desktop: [-0.22, 0], tablet: [0, 0.29], mobile: [0, 0.29] },
  },
  {
    id: 'logo',
    camera: [0, 0, 8],
    target: [0, 0, 0],
    frame: { desktop: [0.22, 0], tablet: [0, 0.29], mobile: [0, 0.29] },
  },
  {
    id: 'branding',
    camera: [-0.4, 0.6, 10],
    target: [0, 0, 0],
    frame: { desktop: [-0.2, 0], tablet: [0, 0.29], mobile: [0, 0.29] },
  },
  {
    id: 'capabilities',
    camera: [0, 0.2, 10],
    target: [0, 0, 0],
    frame: { desktop: [0.2, 0], tablet: [0, 0.32], mobile: [0, 0.32] },
  },
  { id: 'work', camera: [0, 0, 9], target: [0, 0, 0], frame: { desktop: [0, 0], tablet: [0, 0], mobile: [0, 0] } },
  {
    id: 'process',
    camera: [0.3, 0.2, 8],
    target: [0, 0, 0],
    frame: { desktop: [0.22, 0], tablet: [0, 0.29], mobile: [0, 0.29] },
  },
  {
    id: 'about',
    camera: [0, 0, 10],
    target: [0, 0, 0],
    // Upper right, clear of the disciplines list.
    frame: { desktop: [0.27, 0.2], tablet: [0.2, 0.3], mobile: [0.15, 0.32] },
  },
  {
    id: 'philosophy',
    camera: [0, 0, 9],
    target: [0, 0, 0],
    frame: { desktop: [0, 0], tablet: [0, 0], mobile: [0, 0] },
  },
  {
    id: 'namereveal',
    camera: [0, 0, 8],
    target: [0, 0, 0],
    frame: { desktop: [0, 0.06], tablet: [0, 0.08], mobile: [0, 0.14] },
  },
  { id: 'cta', camera: [0, 0, 9], target: [0, 0, 0], frame: { desktop: [0, 0], tablet: [0, 0], mobile: [0, 0] } },
  {
    id: 'contact',
    camera: [0, -0.5, 11],
    target: [0, 0, 0],
    frame: { desktop: [-0.26, -0.22], tablet: [0, 0.3], mobile: [0, 0.3] },
  },
]

export const SCENE_INDEX = Object.fromEntries(SCENES.map((s, i) => [s.id, i]))

/** World-space Y of a scene origin: scenes descend along one vertical path. */
export function sceneY(index) {
  return -index * SCENE_SPACING
}
