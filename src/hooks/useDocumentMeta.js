import { useEffect } from 'react'

const DEFAULT_TITLE = 'IYRA Creations — Websites, SaaS, Branding & Name Reveal Films'

/** Per-route document title and meta description (the static defaults live in index.html). */
export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} — IYRA Creations` : DEFAULT_TITLE
    if (!description) return
    const meta = document.querySelector('meta[name="description"]')
    const previous = meta?.getAttribute('content')
    meta?.setAttribute('content', description)
    return () => {
      if (previous) meta?.setAttribute('content', previous)
    }
  }, [title, description])
}
