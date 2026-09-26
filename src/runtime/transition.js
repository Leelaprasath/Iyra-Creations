/**
 * Page-transition bridge. <PageTransition> registers the cover/reveal runner;
 * <TransitionLink> and the anchor handler call `transitionTo`. If no runner is
 * registered (e.g. during tests) navigation happens immediately.
 */
let runner = null

export function registerTransition(fn) {
  runner = fn
  return () => {
    if (runner === fn) runner = null
  }
}

export function transitionTo(navigate, to, options) {
  if (runner) runner(() => navigate(to, options))
  else navigate(to, options)
}
