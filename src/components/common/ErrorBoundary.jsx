import { Component } from 'react'

/**
 * Contains failures of an enhancement layer (WebGL scenes). Renders `fallback`
 * (default: nothing) and reports once through `onError`, so one broken scene
 * never takes down the page.
 */
export class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info)
    if (import.meta.env.DEV) console.warn('[IYRA] contained render error:', error)
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}
