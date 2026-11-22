import { LOGO_IMAGE } from '../../brand/logoImage'

/**
 * The official IYRA Creations logo image. Decorative by default (the parent
 * link usually carries the accessible name) — pass `alt` when it stands alone.
 */
export function BrandLogo({ height = 40, alt = '', className = '', ...rest }) {
  return (
    <img
      src={LOGO_IMAGE.src}
      width={Math.round((height * LOGO_IMAGE.width) / LOGO_IMAGE.height)}
      height={height}
      alt={alt}
      className={className}
      decoding="async"
      draggable="false"
      {...rest}
    />
  )
}
