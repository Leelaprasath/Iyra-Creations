import { useEffect, useRef } from 'react'
import { subscribe } from '../runtime/tracker'

/**
 * Calls `onProgress({ pin, view })` whenever a tracked section's scroll progress
 * changes. The callback should write to the DOM directly (no React state) —
 * it runs on every animation frame while the section scrolls.
 */
export function useSectionProgress(id, onProgress) {
  const cb = useRef(onProgress)
  useEffect(() => {
    cb.current = onProgress
  })
  useEffect(() => subscribe(id, (s) => cb.current(s)), [id])
}
