import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Service } from '../data/site'
import { site } from '../data/site'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from '../components/Shared'
import { Contact } from '../components/Footer'

export default function ServicePage({ service }: { service: Service }) {
  const other = site.services.find(item => item.slug !== service.slug)!
  return <>
    <section className="service-hero section" aria-labelledby="service-title"><div className="shell">
      <Link className="back-link" to="/"><ArrowLeft size={17} aria-hidden="true" />{site.ui.back}</Link>
      <SectionLabel light>{service.category}</SectionLabel>
      <h1 id="service-title">{service.title}{service.slug === 'bpc' && <span className="service-acronym">BPC</span>}</h1>
      <p className="service-lead">{service.introduction}</p><WhatsAppLink />
    </div></section>
    <section className="section service-body" aria-labelledby="service-content-title"><div className="shell service-body-grid">
      <Reveal><SectionLabel>{site.professional.specialty}</SectionLabel><h2 id="service-content-title">{service.heading}</h2>{service.paragraphs.map(p => <p className="service-paragraph" key={p}>{p}</p>)}<p className="disclaimer">{service.note}</p></Reveal>
      <Reveal className="service-aside"><h3>{site.ui.serviceLabel}</h3><ul>{service.topics.map(topic => <li key={topic}><Check size={18} aria-hidden="true" /><span>{topic}</span></li>)}</ul><AttendanceLocations /><h3 className="aside-contact-heading">{site.ui.serviceContact}</h3><WhatsAppLink className="button-dark" /></Reveal>
    </div></section>
    <div className="shell other-service"><span>{site.areas.label}</span><Link className="text-link" to={`/${other.slug}`}>{other.shortTitle}<ArrowUpRight size={20} aria-hidden="true" /></Link></div>
    <Contact />
  </>
}
