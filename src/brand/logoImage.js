/**
 * The official IYRA Creations logo artwork (white on transparent), used by the
 * header/footer/loader (components/ui/BrandLogo) and the particle intro
 * (3d/particles/sampleText → sampleImageLogo).
 */
export const LOGO_IMAGE = {
  src: '/brand/iyra-logo.png',
  width: 443,
  height: 181,
}

/**
 * Reveal group for a pixel of the logo image (coordinates in image pixels),
 * so the particle intro forms I → Y → R → A → frame → CREATIONS in sequence.
 * Boundaries were measured from public/brand/iyra-logo.png — re-measure them
 * if the artwork changes.
 */
export const LOGO_IMAGE_GROUPS = 6

export function logoImageGroup(x, y) {
  const inBottomGap = y >= 134
  // CREATIONS sits centred between the frame's lower edges.
  if (inBottomGap && x >= 138 && x <= 336) return 5
  // Frame: side bars, top edge and the two bottom corners.
  if (x <= 24 || x >= 416 || y < 30 || inBottomGap) return 4
  if (x < 94) return 0 // I
  if (x < 186) return 1 // Y
  if (x < 300) return 2 // R
  return 3 // A
}
