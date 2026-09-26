import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { Cursor } from './components/common/Cursor'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { FallbackBackdrop } from './components/common/FallbackBackdrop'
import { Loader } from './components/common/Loader'
import { PageTransition } from './components/common/PageTransition'
import { Header } from './components/navigation/Header'
import { Footer } from './sections/Footer/Footer'
import { useAnchorNavigation } from './hooks/useAnchorNavigation'
import { useEnvironmentSync } from './hooks/useEnvironmentSync'
import HomePage from './pages/HomePage'
import { startSmoothScroll } from './runtime/smoothScroll'
import { useAppStore } from './store/useAppStore'

const Experience = lazy(() => import('./3d/core/Experience'))
const ProjectPage = lazy(() => import('./pages/ProjectPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const FONT_TIMEOUT_MS = 3000

function useFontReadiness() {
  const completeLoadStep = useAppStore((s) => s.completeLoadStep)
  useEffect(() => {
    const done = () => completeLoadStep('fonts')
    const timer = setTimeout(done, FONT_TIMEOUT_MS)
    Promise.all([document.fonts.load('800 100px "Inter Variable"'), document.fonts.load('400 16px "Inter Variable"')])
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer)
        done()
      })
    return () => clearTimeout(timer)
  }, [completeLoadStep])
}

export default function App() {
  const tier = useAppStore((s) => s.tier)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const setWebglFailed = useAppStore((s) => s.setWebglFailed)

  useEnvironmentSync()
  useAnchorNavigation()
  useFontReadiness()

  useEffect(() => startSmoothScroll({ smooth: !reducedMotion }), [reducedMotion])

  useEffect(() => {
    document.documentElement.dataset.tier = tier
  }, [tier])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {tier === 'fallback' ? (
        <FallbackBackdrop />
      ) : (
        <ErrorBoundary onError={setWebglFailed}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </ErrorBoundary>
      )}

      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />

      <Loader />
      <PageTransition />
      <Cursor />
    </>
  )
}
