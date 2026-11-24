import { useLayoutEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'motion/react'
import { site } from './data/site'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ServicePage from './pages/ServicePage'
import NotFound from './pages/NotFound'
import { useReducedMotion } from './hooks/useReducedMotion'
import PageTransition from './components/PageTransition'

const loadMotionFeatures = () => import('./motion-features').then(module => module.default)

function NavigationEffects() {
  const { pathname, hash, key } = useLocation()
  const completedNavigation = useRef<{ key: string; pathname: string; hash: string } | null>(null)
  useLayoutEffect(() => {
    // StrictMode replays mount effects in development; one navigation must focus only once.
    const previous = completedNavigation.current
    const alreadyFocused = previous?.key === key && previous.pathname === pathname && previous.hash === hash
    completedNavigation.current = { key, pathname, hash }
    const service = site.services.find(item => pathname === `/${item.slug}`)
    const title = service ? `${service.shortTitle} | ${site.professional.name}` : pathname === '/' ? site.seo.title : `${site.ui.notFoundLabel} | ${site.professional.name}`
    const description = service?.description ?? site.seo.description
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    // Complete navigation before paint, so a deferred focus cannot steal the user's first interaction.
    const target = hash ? document.getElementById(hash.slice(1)) : document.getElementById('main-content')
    if (hash && target) {
      target.setAttribute('tabindex', '-1')
      if (!alreadyFocused) target.focus({ preventScroll: true })
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
      // WebKit can adjust scroll after the desktop journey acquires its pinned height.
      // Reconcile once after layout, without ever focusing again or overriding user input.
      let frame = requestAnimationFrame(() => {
        frame = 0
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
        if (Math.abs(target.getBoundingClientRect().top - offset) > 2) target.scrollIntoView({ behavior: 'instant', block: 'start' })
        removeListeners()
      })
      const cancel = () => { cancelAnimationFrame(frame); removeListeners() }
      const removeListeners = () => {
        window.removeEventListener('keydown', cancel, true)
        window.removeEventListener('pointerdown', cancel, true)
        window.removeEventListener('touchstart', cancel, true)
        window.removeEventListener('wheel', cancel, true)
      }
      window.addEventListener('keydown', cancel, true)
      window.addEventListener('pointerdown', cancel, { capture: true, passive: true })
      window.addEventListener('touchstart', cancel, { capture: true, passive: true })
      window.addEventListener('wheel', cancel, { capture: true, passive: true })
      return cancel
    } else {
      if (!alreadyFocused) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        target?.focus({ preventScroll: true })
      }
    }
  }, [pathname, hash, key])
  return null
}

export default function App() {
  const reduced = useReducedMotion()
  return <LazyMotion features={loadMotionFeatures} strict><MotionConfig reducedMotion={reduced ? 'always' : 'never'}><a className="skip-link" href="#main-content">{site.ui.skip}</a><Header />
    <main id="main-content" tabIndex={-1}><PageTransition><Routes>
      <Route path="/" element={<Home />} />
      {site.services.map(service => <Route path={`/${service.slug}`} key={service.slug} element={<ServicePage service={service} />} />)}
      <Route path="*" element={<NotFound />} />
  </Routes></PageTransition></main><Footer /><NavigationEffects />
  </MotionConfig></LazyMotion>
}
