import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToTarget } from '../runtime/smoothScroll'
import { transitionTo } from '../runtime/transition'

/** Moves keyboard focus to a section after scrolling so screen readers follow. */
function focusSection(el) {
  if (!el) return
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function scrollToSection(id, { immediate = false } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  scrollToTarget(el, { immediate })
  focusSection(el)
}

/**
 * Handles in-page links (`#id` and `/#id`) globally:
 * on the home page they scroll smoothly via Lenis; elsewhere they transition
 * home first and scroll once the page has rendered.
 */
export function useAnchorNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a) return
      const href = a.getAttribute('href')
      const match = href.match(/^\/?#([\w-]+)$/)
      if (!match) return
      e.preventDefault()
      const id = match[1]
      if (window.location.pathname === '/') {
        history.replaceState(null, '', `#${id}`)
        scrollToSection(id)
      } else {
        transitionTo(navigate, `/#${id}`)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // Arriving on the home page with a hash (from another route or a shared link).
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return
    const id = location.hash.slice(1)
    const t = setTimeout(() => scrollToSection(id, { immediate: true }), 60)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash])
}
