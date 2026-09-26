/**
 * Analytics-ready event hook. No tracking service is configured, so events are
 * only dispatched as a DOM CustomEvent and pushed to window.dataLayer if a tag
 * manager has been added. Event names: start_project_clicked, service_viewed,
 * project_opened, name_reveal_clicked, contact_started, contact_submitted.
 */
export function track(event, props = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('iyra:analytics', { detail: { event, ...props } }))
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...props })
}
