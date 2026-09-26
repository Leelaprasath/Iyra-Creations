/**
 * Demonstration name reveal. ANAYA is a fictional example name.
 * `timeline` maps the pinned scroll progress (0..1) to reveal beats and is
 * shared by the WebGL engine and the DOM layer so both stay in sync.
 */
export const nameRevealDemo = {
  name: 'ANAYA',
  subtitle: 'A new chapter',
  accentColor: '#DB622B',
  style: 'particles',
  timeline: {
    dust: [0.02, 0.14],
    letters: [0.14, 0.66],
    subtitle: [0.68, 0.76],
    outro: [0.8, 0.9],
  },
}
