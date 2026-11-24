import { useLayoutEffect, useRef } from 'react'
import { site } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Artwork from './Artwork'
import DragRail from './DragRail'
import { SectionLabel } from './Shared'

/** Native horizontal scrolling, linked to the document only while the desktop section is pinned. */
export default function HorizontalJourney() {
  const section = useRef<HTMLDivElement>(null)
  const sticky = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    const outer = section.current!, stage = sticky.current!, rail = viewport.current!
    let frame = 0, measureFrame = 0, pinned = false, start = 0, distance = 0
    let pageAppliedPosition: number | null = null
    let railAppliedPagePosition: number | null = null
    const clamp = (value: number) => Math.max(0, Math.min(distance, value))
    const updateProgress = () => outer.style.setProperty('--journey-progress', String(distance > 0 ? rail.scrollLeft / distance : 0))
    const updateFromPage = () => {
      frame = 0
      if (pinned) {
        // A native horizontal animation may advance again before this page event arrives.
        if (railAppliedPagePosition !== null && Math.abs(scrollY - railAppliedPagePosition) < 1.5) { updateProgress(); return }
        railAppliedPagePosition = null
        const target = clamp(window.scrollY - start)
        if (Math.abs(rail.scrollLeft - target) > 1) {
          rail.scrollLeft = target
          pageAppliedPosition = rail.scrollLeft
        }
      }
      updateProgress()
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateFromPage) }
    const measure = () => {
      const wasPinnedHere = pinned && scrollY >= start && scrollY <= start + distance
      railAppliedPagePosition = null
      const top = (document.querySelector('.site-header')?.getBoundingClientRect().height ?? 80) + 16
      outer.style.setProperty('--journey-top', `${top}px`)
      distance = Math.max(0, rail.scrollWidth - rail.clientWidth)
      const height = stage.getBoundingClientRect().height
      const enabled = !reduced && window.innerWidth >= 1024 && height + top + 24 < window.innerHeight && distance > 2
      pinned = enabled
      outer.classList.toggle('is-scroll-driven', pinned)
      const sectionHeight = pinned ? `${height + distance}px` : ''
      if (outer.style.height !== sectionHeight) outer.style.height = sectionHeight
      start = outer.getBoundingClientRect().top + scrollY - top
      if (!pinned && wasPinnedHere) window.scrollTo({ top: start, behavior: 'instant' })
      schedule()
    }
    const onRailScroll = () => {
      updateProgress()
      // A delayed event from our own write must not undo a newer vertical scroll.
      if (pageAppliedPosition !== null && Math.abs(rail.scrollLeft - pageAppliedPosition) < 1.5) return
      pageAppliedPosition = null
      // Buttons, keyboard, horizontal trackpad and dragging keep their native behavior.
      if (pinned && scrollY >= start - 2 && scrollY <= start + distance + 2 && Math.abs(rail.scrollLeft - clamp(scrollY - start)) > 2) {
        window.scrollTo({ top: start + rail.scrollLeft, behavior: 'instant' })
        railAppliedPagePosition = scrollY
      }
    }
    // Wait until the next frame before changing layout observed by ResizeObserver.
    const scheduleMeasure = () => {
      if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure() })
    }
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(stage)
    observer.observe(rail.firstElementChild!)
    const header = document.querySelector('.site-header')
    if (header) observer.observe(header)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    rail.addEventListener('scroll', onRailScroll, { passive: true })
    measure()
    return () => {
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measureFrame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', scheduleMeasure)
      rail.removeEventListener('scroll', onRailScroll)
      const preserve = pinned && scrollY >= start && scrollY <= start + distance && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      outer.classList.remove('is-scroll-driven')
      outer.style.height = ''
      if (preserve) window.scrollTo({ top: start, behavior: 'instant' })
    }
  }, [reduced])

  return <section id="principios" className="section journey-section" aria-labelledby="principios-title">
    <div className="shell"><div className="horizontal-journey" ref={section}>
      <div className="journey-sticky" ref={sticky}>
        <h2 id="principios-title" className="sr-only">{site.approach.label}</h2>
        <SectionLabel>{site.approach.label}</SectionLabel>
        <DragRail label={site.approach.label} className="journey-rail" viewportRef={viewport}>
          {site.approach.items.map((item, index) => <article className={`journey-panel journey-panel-${index + 1}`} key={item.title}>
            <div className="journey-copy"><span className="journey-position" aria-hidden="true">0{index + 1} / 0{site.approach.items.length}</span><h3>{item.title}</h3><p>{item.description}</p></div>
            <Artwork asset={item.illustration} className="journey-art" />
          </article>)}
        </DragRail>
        <div className="journey-progress" aria-hidden="true"><span /></div>
      </div>
    </div></div>
  </section>
}
