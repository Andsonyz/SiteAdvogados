import { Children, useEffect, useId, useRef, useState } from 'react'
import type { PropsWithChildren, PointerEvent, KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { site } from '../data/site'

/** Native touch scrolling + scroll snap. Mouse capture begins only after a horizontal drag threshold. */
export default function DragRail({ children, label, className = '' }: PropsWithChildren<{ label: string; className?: string }>) {
  const viewport = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ id: number; x: number; y: number; scroll: number; dragging: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [dragging, setDragging] = useState(false)
  const [scroll, setScroll] = useState({ overflow: false, start: true, end: true })
  const reduced = useReducedMotion()
  const id = useId()
  useEffect(() => {
    const node = viewport.current!
    const update = () => setScroll({ overflow: node.scrollWidth > node.clientWidth + 3, start: node.scrollLeft < 3, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 3 })
    const observer = new ResizeObserver(update)
    observer.observe(node); observer.observe(node.firstElementChild!)
    node.addEventListener('scroll', update, { passive: true }); update()
    return () => { observer.disconnect(); node.removeEventListener('scroll', update) }
  }, [children])
  function go(direction: -1 | 1) {
    const node = viewport.current!
    const item = node.querySelector('li')!
    node.scrollBy({ left: direction * (item.getBoundingClientRect().width + 24), behavior: reduced ? 'instant' : 'smooth' })
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !scroll.overflow) return
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      if (event.key === 'Home' || event.key === 'End') viewport.current!.scrollTo({ left: event.key === 'Home' ? 0 : viewport.current!.scrollWidth, behavior: reduced ? 'instant' : 'smooth' })
      else go(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false
    if (!scroll.overflow || event.pointerType !== 'mouse' || event.button !== 0) return
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, scroll: event.currentTarget.scrollLeft, dragging: false }
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = pointer.current
    if (!gesture || gesture.id !== event.pointerId) return
    if ((event.buttons & 1) === 0) { finish(event); return }
    const dx = event.clientX - gesture.x
    if (!gesture.dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - gesture.y)) {
      gesture.dragging = true; suppressClick.current = true; setDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (gesture.dragging) { event.preventDefault(); event.currentTarget.scrollLeft = gesture.scroll - dx }
  }
  function finish(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    pointer.current = null; setDragging(false)
  }
  return <div className={`drag-rail ${dragging ? 'is-dragging' : ''} ${className}`} role="region" aria-label={label}>
    <div ref={viewport} id={id} className="rail-viewport" tabIndex={scroll.overflow ? 0 : -1} aria-label={label} aria-describedby={scroll.overflow ? `${id}-hint` : undefined}
      onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { pointer.current = null; setDragging(false) }}
      onPointerLeave={() => { if (pointer.current && !pointer.current.dragging) pointer.current = null }}
      onDragStart={event => event.preventDefault()} onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false } }}>
      <ul className="rail-track">{Children.map(children, (child, index) => <li className="rail-item" key={index}>{child}</li>)}</ul>
    </div>
    {scroll.overflow && <div className="rail-tools"><p id={`${id}-hint`}>{site.ui.railHint}</p><div className="rail-buttons">
      <button type="button" onClick={() => go(-1)} disabled={scroll.start} aria-label={site.ui.previous} aria-controls={id}><ArrowLeft size={19} aria-hidden="true" /></button>
      <button type="button" onClick={() => go(1)} disabled={scroll.end} aria-label={site.ui.next} aria-controls={id}><ArrowRight size={19} aria-hidden="true" /></button>
    </div></div>}
  </div>
}
