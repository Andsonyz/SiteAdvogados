import { motion, useReducedMotion } from 'motion/react'
import { MessageCircle, ArrowUpRight, MapPin, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { site, whatsappUrl } from '../data/site'

export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link to="/" className={`brand ${footer ? 'brand-footer' : ''}`} aria-label={`${site.professional.name} — ${site.ui.home}`}>
    {footer ? <img className="brand-logo" src={site.professional.logo.src} alt={site.professional.logo.alt} width={site.professional.logo.width} height={site.professional.logo.height} loading="lazy" /> : <>
    <span className="brand-name">{site.professional.name}</span>
    <span className="brand-specialty">{site.professional.specialty}</span>
    </>}
  </Link>
}

export function WhatsAppLink({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return <a className={`button ${className}`} href={whatsappUrl} target="_blank" rel="noopener noreferrer">
    <MessageCircle size={18} aria-hidden="true" />
    <span>{compact ? site.ui.contact : site.contact.cta}</span>
    {!compact && <ArrowUpRight className="button-arrow" size={17} aria-hidden="true" />}
  </a>
}

export function SectionLabel({ children, light = false }: PropsWithChildren<{ light?: boolean }>) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span aria-hidden="true" />{children}</p>
}

export function Reveal({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={false}
    whileInView={reduced ? undefined : { y: [14, 0], opacity: [0.85, 1] }}
    transition={{ duration: 0.45, ease: 'easeOut' }} viewport={{ once: true, amount: 0.12 }}>
    {children}
  </motion.div>
}

export function AttendanceLocations({ className = '' }: { className?: string }) {
  return <div className={`locations ${className}`}>
    <p><Smartphone size={16} aria-hidden="true" />{site.contact.online}</p>
    <p><MapPin size={16} aria-hidden="true" />{site.contact.region}</p>
  </div>
}
