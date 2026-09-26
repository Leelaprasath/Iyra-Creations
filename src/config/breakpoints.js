/** Layout breakpoints in CSS pixels. Mirrored in CSS media queries (768 / 1024). */
export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
}

export function getLayout(width) {
  if (width < BREAKPOINTS.tablet) return 'mobile'
  if (width < BREAKPOINTS.desktop) return 'tablet'
  return 'desktop'
}
