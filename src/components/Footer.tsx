import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { AttendanceLocations, Brand, Reveal, SectionLabel, WhatsAppLink } from './Shared'

export function Contact() {
  return <section id="contato" className="contact-section section" aria-labelledby="contact-title">
    <div className="shell contact-grid">
      <Reveal><SectionLabel light>{site.closing.label}</SectionLabel><h2 id="contact-title">{site.closing.title}</h2><p className="section-intro">{site.closing.description}</p></Reveal>
      <Reveal className="contact-details">
        <WhatsAppLink />
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-phone">{site.contact.phone}<ArrowUpRight size={20} aria-hidden="true" /></a>
        <AttendanceLocations />
        <a className="instagram-link" href={site.contact.instagram} target="_blank" rel="noopener noreferrer"><span>{site.contact.instagramLabel}</span><ArrowUpRight size={14} aria-hidden="true" /></a>
      </Reveal>
    </div>
  </section>
}

export default function Footer() {
  return <>
    <footer className="site-footer">
      <div className="shell footer-top"><Brand footer /><div className="footer-professional"><p>{site.professional.location}</p>{site.professional.oab.trim() && <p>OAB {site.professional.oab}</p>}</div><a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" className="footer-social">Instagram <ArrowUpRight size={15} aria-hidden="true" /></a></div>
      <div className="shell footer-bottom"><p>© {new Date().getFullYear()} {site.professional.name}. {site.footer.rights}</p><span>{site.professional.specialty}</span></div>
    </footer>
    <a className="floating-contact" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`${site.contact.cta} — ${site.professional.name}`}><MessageCircle size={23} aria-hidden="true" /></a>
  </>
}
