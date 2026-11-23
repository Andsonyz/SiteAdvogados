import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** A visual reading cue. Native wheel, touch, keyboard and scrollbar behavior are untouched. */
export default function ScrollProgress() {
  const fill = useRef<HTMLSpanElement>(null)
  const { key } = useLocation()
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
      if (fill.current) fill.current.style.transform = `scaleX(${progress})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [key])
  return <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress-fill" ref={fill} /></div>
}
