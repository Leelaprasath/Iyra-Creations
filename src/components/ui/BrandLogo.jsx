/** Natural size of public/brand/iyra-logo.png (white artwork, transparent background). */
const WIDTH = 443
const HEIGHT = 181

/**
 * The official IYRA Creations logo image. Decorative by default (the parent
 * link usually carries the accessible name) — pass `alt` when it stands alone.
 */
export function BrandLogo({ height = 40, alt = '', className = '', ...rest }) {
  return (
    <img
      src="/brand/iyra-logo.png"
      width={Math.round((height * WIDTH) / HEIGHT)}
      height={height}
      alt={alt}
      className={className}
      decoding="async"
      draggable="false"
      {...rest}
    />
  )
}
