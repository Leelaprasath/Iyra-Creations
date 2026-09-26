/**
 * Normalised pointer position (-1..1), shared by camera, lights and cursor.
 * One passive listener for the whole app. Touch input is ignored on purpose:
 * touch devices get no pointer parallax.
 */
export const pointer = { x: 0, y: 0, clientX: -100, clientY: -100, active: false }

export function attachPointer() {
  const onMove = (e) => {
    if (e.pointerType === 'touch') return
    pointer.clientX = e.clientX
    pointer.clientY = e.clientY
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    pointer.active = true
  }
  const onLeave = () => {
    pointer.active = false
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
  return () => {
    window.removeEventListener('pointermove', onMove)
    document.documentElement.removeEventListener('pointerleave', onLeave)
  }
}
