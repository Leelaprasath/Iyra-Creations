import { LOGO_PARTS, LOGO_VIEWBOX } from '../../brand/logo'

const VIEWBOX = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`

/**
 * The IYRA Creations logo. Inherits `currentColor` (white on the dark site).
 * Decorative by default — pass `title` when the logo is the only label.
 */
export function Logo({ className = '', height = 40, title }) {
  return (
    <svg
      className={className}
      viewBox={VIEWBOX}
      height={height}
      width={(height * LOGO_VIEWBOX.width) / LOGO_VIEWBOX.height}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {LOGO_PARTS.map((p) => (
        <path key={p.id} d={p.d} fillRule="evenodd" />
      ))}
    </svg>
  )
}
