import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { Brand, WhatsAppLink } from './Shared'

export default function Header() {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location])
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus() }
    }
    const onPointer = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    const media = window.matchMedia('(min-width: 1024px)')
    const onResize = () => { if (media.matches) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    media.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      media.removeEventListener('change', onResize)
    }
  }, [open])
  return <header className="site-header" ref={header}>
    <div className="shell header-inner">
      <Brand />
      <button ref={button} type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-navigation"
        aria-label={open ? site.ui.closeMenu : site.ui.openMenu} onClick={() => setOpen(!open)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="main-navigation" aria-label="Menu principal" className={`navigation ${open ? 'is-open' : ''}`}>
        {site.navigation.map(item => <Link key={item.id} to={`/#${item.id}`} onClick={() => setOpen(false)}>{item.label}</Link>)}
        <WhatsAppLink compact className="button-header" />
      </nav>
    </div>
  </header>
}
