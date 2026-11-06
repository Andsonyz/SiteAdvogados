import { useState } from 'react'
import { ArrowDown, ArrowUpRight, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from '../components/Shared'
import Faq from '../components/Faq'
import { Contact } from '../components/Footer'

function Hero() {
  const [imageFailed, setImageFailed] = useState(false)
  const portrait = site.professional.portrait
  const hasPortrait = Boolean(portrait.src) && !imageFailed
  return <section className={`hero ${hasPortrait ? 'has-portrait' : 'without-portrait'}`} aria-labelledby="hero-title">
    <div className="shell hero-layout">
      <div className="hero-copy">
        <SectionLabel light>{site.hero.eyebrow}</SectionLabel>
        <h1 id="hero-title">{site.professional.name}</h1>
        <p className="hero-specialty">{site.professional.specialty}</p>
        <p className="hero-description">{site.hero.description}</p>
        <WhatsAppLink />
        <AttendanceLocations />
      </div>
      {hasPortrait ? <div className="portrait-composition">
        <img className="hero-portrait" src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" onError={() => setImageFailed(true)} />
      </div> : <div className="editorial-composition" aria-hidden="true">
        <div className="editorial-arch"><span className="editorial-initials">IS</span><span className="editorial-line" /><p>{site.hero.editorial}</p></div>
        <span className="editorial-caption">{site.professional.specialty}</span>
      </div>}
      <div className="hero-bottom">
        <div className="experience"><span>{site.professional.experience}</span><span>{site.hero.experienceLabel}</span></div>
        <a href="#atuacao" className="discover-link">{site.hero.discover}<ArrowDown size={17} aria-hidden="true" /></a>
      </div>
    </div>
  </section>
}

function About() {
  return <section id="sobre" className="section about-section" aria-labelledby="about-title">
    <div className="shell about-grid">
      <Reveal className="about-heading"><SectionLabel>{site.about.label}</SectionLabel><h2 id="about-title">{site.about.title}</h2><img className="about-logo" src={site.professional.logo.src} alt={site.professional.logo.alt} width={site.professional.logo.width} height={site.professional.logo.height} loading="lazy" /></Reveal>
      <Reveal className="about-copy">{site.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p className="about-note"><span aria-hidden="true" />{site.about.signature}</p></Reveal>
    </div>
  </section>
}

function Areas() {
  return <section id="atuacao" className="section areas-section" aria-labelledby="areas-title">
    <div className="shell">
      <Reveal className="section-heading"><div><SectionLabel>{site.areas.label}</SectionLabel><h2 id="areas-title">{site.areas.title}</h2></div><p className="section-intro">{site.areas.description}</p></Reveal>
      <div className="service-grid">{site.services.map(service => <Reveal key={service.slug} className="service-card">
        <span className="service-number">{service.number}<span className="service-number-line" /></span>
        <p className="service-category">{service.category}</p>
        <h3>{service.shortTitle}</h3>
        <p className="service-description">{service.description}</p>
        <Link className="text-link" to={`/${service.slug}`}>{service.linkLabel}<ArrowUpRight size={19} aria-hidden="true" /></Link>
      </Reveal>)}</div>
    </div>
  </section>
}

function Attendance() {
  return <section id="atendimento" className="section attendance-section" aria-labelledby="attendance-title">
    <div className="shell">
      <Reveal className="section-heading"><div><SectionLabel>{site.attendance.label}</SectionLabel><h2 id="attendance-title">{site.attendance.title}</h2></div><p className="section-intro">{site.attendance.description}</p></Reveal>
      <ol className="steps-grid">{site.attendance.steps.map((step, index) => <li key={step.title}>
        <Reveal><div className="step-top"><span>0{index + 1}</span>{index < 2 ? <ArrowRight size={20} aria-hidden="true" /> : <Check size={20} aria-hidden="true" />}</div><h3>{step.title}</h3><p>{step.description}</p></Reveal>
      </li>)}</ol>
      <Reveal className="attendance-bottom"><AttendanceLocations /><WhatsAppLink className="button-dark" /></Reveal>
    </div>
  </section>
}

export default function Home() {
  return <><Hero /><About /><Areas /><Attendance /><Faq /><Contact /></>
}
