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

const loadMotionFeatures = () => import('./motion-features').then(module => module.default)

function NavigationEffects() {
  const { pathname, hash, key } = useLocation()
  const completedNavigation = useRef<{ key: string; pathname: string; hash: string } | null>(null)
  useLayoutEffect(() => {
    // StrictMode replays mount effects in development; one navigation must focus only once.
    const previous = completedNavigation.current
    if (previous && previous.key === key && previous.pathname === pathname && previous.hash === hash) return
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
      target.focus({ preventScroll: true })
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
      target?.focus({ preventScroll: true })
    }
  }, [pathname, hash, key])
  return null
}

export default function App() {
  const reduced = useReducedMotion()
  return <LazyMotion features={loadMotionFeatures} strict><MotionConfig reducedMotion={reduced ? 'always' : 'never'}><NavigationEffects /><a className="skip-link" href="#main-content">{site.ui.skip}</a><Header />
    <main id="main-content" tabIndex={-1}><Routes>
      <Route path="/" element={<Home />} />
      {site.services.map(service => <Route path={`/${service.slug}`} key={service.slug} element={<ServicePage service={service} />} />)}
      <Route path="*" element={<NotFound />} />
    </Routes></main><Footer />
  </MotionConfig></LazyMotion>
}
