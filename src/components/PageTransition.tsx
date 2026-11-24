import { useLayoutEffect, useRef, type PropsWithChildren } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { animate } from 'motion/mini'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Visit = { key: string; pathname: string }

/** One live route, with session-local history direction and no delayed navigation/focus. */
export default function PageTransition({ children }: PropsWithChildren) {
  const location = useLocation()
  const navigationType = useNavigationType()
  const reduced = useReducedMotion()
  const element = useRef<HTMLDivElement>(null)
  const initialVisit = { key: location.key, pathname: location.pathname }
  const history = useRef<{ visits: Visit[]; index: number; current: Visit }>({ visits: [initialVisit], index: 0, current: initialVisit })

  useLayoutEffect(() => {
    const node = element.current!
    const record = history.current
    const previous = record.current
    const visit = { key: location.key, pathname: location.pathname }
    const changedPage = previous.pathname !== location.pathname
    let direction = 0

    if (previous.key !== visit.key || changedPage) {
      if (navigationType === 'POP') {
        const index = record.visits.findIndex(item => item.key === visit.key && item.pathname === visit.pathname)
        if (index >= 0) {
          direction = record.index < 0 ? 0 : Math.sign(index - record.index)
          record.index = index
        } else {
          // Keep known visits: returning through an older entry must not erase forward history.
          // The first return from this unknown position is immediate, then direction is known again.
          record.index = -1
        }
      } else {
        direction = location.pathname === '/' ? -1 : 1
        if (navigationType === 'REPLACE' && record.index >= 0) record.visits[record.index] = visit
        else {
          record.visits = [...record.visits.slice(0, record.index + 1), visit]
          record.index++
        }
      }
      record.current = visit
    }

    // Keep the independent opening animation for document loads only, never stack it on a slide.
    if (changedPage) node.setAttribute('data-route-arrival', '')
    if (!changedPage || !direction || location.hash || reduced || typeof node.animate !== 'function') return

    let active = true
    node.setAttribute('data-route-entering', direction > 0 ? 'right' : 'left')
    node.style.willChange = 'transform'
    const animation = animate(node, { transform: [`translateX(${direction * 100}%)`, 'translateX(0%)'] }, {
      duration: 0.36,
      ease: [0.22, 1, 0.36, 1],
    })
    const finish = () => {
      if (!active) return
      active = false
      animation.cancel()
      node.style.removeProperty('transform')
      node.style.removeProperty('will-change')
      node.removeAttribute('data-route-entering')
      window.removeEventListener('keydown', finish, true)
      window.removeEventListener('pointerdown', finish, true)
      window.removeEventListener('touchstart', finish, true)
      window.removeEventListener('wheel', finish, true)
      window.removeEventListener('resize', finish)
    }
    // Listen to user intent rather than scroll events: route/anchor positioning is programmatic.
    window.addEventListener('keydown', finish, true)
    window.addEventListener('pointerdown', finish, { capture: true, passive: true })
    window.addEventListener('touchstart', finish, { capture: true, passive: true })
    window.addEventListener('wheel', finish, { capture: true, passive: true })
    window.addEventListener('resize', finish)
    void animation.finished.then(finish)
    return finish
  }, [location.key, location.pathname, location.hash, navigationType, reduced])

  return <div className="route-transition" ref={element}>{children}</div>
}
