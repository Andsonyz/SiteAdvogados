import { useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { artwork, site } from '../data/site'
import Artwork from '../components/Artwork'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from '../components/Shared'
import Attendance from '../components/Attendance'
import Reviews from '../components/Reviews'
import Faq from '../components/Faq'
import { Contact } from '../components/Footer'

function Hero() {
  const [imageFailed, setImageFailed] = useState(false)
  const portrait = site.professional.portrait
  return <section className="hero" aria-labelledby="hero-title">
    <div className="shell hero-layout">
      <div className="hero-identity">
        <div><SectionLabel light>{site.hero.eyebrow}</SectionLabel></div>
        <h1 id="hero-title">{site.professional.name.split(' ').map((part, index) => <span key={index}>{index > 0 ? ' ' : ''}{part}</span>)}</h1>
        <p className="hero-specialty">{site.professional.specialty}</p>
      </div>
      {portrait.src && !imageFailed ? <div className="portrait-composition">
        <img className="hero-portrait" src={portrait.src} srcSet={portrait.srcSet} sizes={portrait.sizes} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" decoding="async" onError={() => setImageFailed(true)} />
      </div> : <div className="portrait-fallback" aria-hidden="true"><span>IS</span></div>}
      <div className="hero-copy"><p className="hero-description">{site.hero.description}</p><div className="hero-actions"><WhatsAppLink /></div></div>
      <div className="hero-bottom">
        <AttendanceLocations />
        <div className="experience"><span>{site.professional.experience}</span><span>{site.hero.experienceLabel}</span></div>
        <a href="#atuacao" className="discover-link">{site.hero.discover}<ArrowDown size={19} aria-hidden="true" /></a>
      </div>
    </div>
  </section>
}

function About() {
  return <section id="sobre" className="section about-section" aria-labelledby="about-title">
    <div className="shell about-grid">
      <Reveal className="about-heading"><SectionLabel>{site.about.label}</SectionLabel><h2 id="about-title">{site.about.title}</h2><p className="about-side-note">{site.professional.specialty}<br />{site.professional.location} e região</p><Artwork asset={artwork.books} className="about-books" depth /></Reveal>
      <Reveal className="about-copy" delay={0.1}>{site.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="about-signoff"><img className="about-logo" src={site.professional.logo.src} srcSet={site.professional.logo.srcSet} sizes={site.professional.logo.sizes} alt={site.professional.logo.alt} width={site.professional.logo.width} height={site.professional.logo.height} loading="lazy" /><p>{site.about.signature}</p></div></Reveal>
    </div>
  </section>
}

function Areas() {
  return <section id="atuacao" className="section areas-section" aria-labelledby="areas-title">
    <div className="shell">
      <Reveal className="section-heading"><div><SectionLabel>{site.areas.label}</SectionLabel><h2 id="areas-title">{site.areas.title}</h2></div><p className="section-intro">{site.areas.description}</p></Reveal>
      <ul className="services-list" aria-label={site.ui.servicesRail}>{site.services.map((service, index) => <li key={service.slug}><Reveal className="service-card-reveal" delay={index * 0.04}><article className="service-card">
        <div className="service-card-visual"><span className="service-number">{service.number}</span><Artwork asset={service.slug === 'aposentadorias' ? artwork.retirement : artwork.care} className="service-illustration" depth /></div>
        <div className="service-card-copy"><p className="service-category">{service.category}</p><h3>{service.shortTitle}</h3><p className="service-description">{service.description}</p><Link className="text-link" to={`/${service.slug}`}>{service.linkLabel}<ArrowUpRight size={20} aria-hidden="true" /></Link></div>
      </article></Reveal></li>)}</ul>
    </div>
  </section>
}

export default function Home() {
  return <><Hero /><About /><Areas /><Attendance /><Faq /><Reviews /><Contact /></>
}
