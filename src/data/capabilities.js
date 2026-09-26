/**
 * "Our creative universe". `shape` selects the core form in the WebGL scene;
 * `warmth` (0–1) shifts the lighting from neutral white toward IYRA orange.
 */
export const capabilities = [
  { id: 'direction', name: 'Creative Direction', text: 'One idea, held consistently from first sketch to final frame.', shape: 'icosahedron', warmth: 0.7 },
  { id: 'uiux', name: 'UI/UX Design', text: 'Interfaces that feel obvious — structured, calm and quick to learn.', shape: 'box', warmth: 0.3 },
  { id: 'web', name: 'Website Development', text: 'Fast, accessible, search-ready sites with motion that serves the story.', shape: 'octahedron', warmth: 0.45 },
  { id: 'saas', name: 'SaaS Development', text: 'Product architecture and front-ends built to scale with your users.', shape: 'dodecahedron', warmth: 0.35 },
  { id: '3d', name: '3D Web Experiences', text: 'Real-time WebGL worlds that run in the browser, tuned for every device.', shape: 'torusKnot', warmth: 0.85 },
  { id: 'brand', name: 'Brand Identity', text: 'Marks, colour and type that become unmistakably yours.', shape: 'tetrahedron', warmth: 0.6 },
  { id: 'motion', name: 'Motion Design', text: 'Timing and movement that give a brand its rhythm.', shape: 'torus', warmth: 0.75 },
  { id: 'video', name: 'Video Production', text: 'Cinematic reveals and short films, from concept to final render.', shape: 'sphere', warmth: 1 },
]
