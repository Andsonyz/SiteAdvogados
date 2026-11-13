import { useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from '../components/Shared'
import DragRail from '../components/DragRail'
import Reviews from '../components/Reviews'
import Faq from '../components/Faq'
import { Contact } from '../components/Footer'

function Hero() {
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  const portrait = site.professional.portrait
  const enter = (order: number) => ({ initial: reduced ? false as const : { opacity: 0.72, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduced ? 0 : 0.6, delay: reduced ? 0 : order * 0.09 } })
  return <section className="hero" aria-labelledby="hero-title">
    <div className="shell hero-layout">
      <div className="hero-copy">
        <motion.div {...enter(0)}><SectionLabel light>{site.hero.eyebrow}</SectionLabel></motion.div>
        <motion.h1 id="hero-title" {...enter(1)}>{site.professional.name}</motion.h1>
        <motion.p className="hero-specialty" {...enter(2)}>{site.professional.specialty}</motion.p>
        <motion.p className="hero-description" {...enter(3)}>{site.hero.description}</motion.p>
        <motion.div className="hero-actions" {...enter(4)}><WhatsAppLink /><AttendanceLocations /></motion.div>
      </div>
      {portrait.src && !imageFailed ? <motion.div className="portrait-composition" {...enter(2)}>
        <img className="hero-portrait" src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} fetchPriority="high" decoding="async" onError={() => setImageFailed(true)} />
      </motion.div> : <div className="portrait-fallback" aria-hidden="true"><span>IS</span></div>}
      <motion.div className="hero-bottom" {...enter(5)}>
        <div className="experience"><span>{site.professional.experience}</span><span>{site.hero.experienceLabel}</span></div>
        <a href="#atuacao" className="discover-link">{site.hero.discover}<ArrowDown size={19} aria-hidden="true" /></a>
      </motion.div>
    </div>
  </section>
}

function About() {
  return <section id="sobre" className="section about-section" aria-labelledby="about-title">
    <div className="shell about-grid">
      <Reveal className="about-heading"><SectionLabel>{site.about.label}</SectionLabel><h2 id="about-title">{site.about.title}</h2><p className="about-side-note">{site.professional.specialty}<br />{site.professional.location} e região</p></Reveal>
      <Reveal className="about-copy" delay={0.1}>{site.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="about-signoff"><img className="about-logo" src={site.professional.logo.src} alt={site.professional.logo.alt} width={site.professional.logo.width} height={site.professional.logo.height} loading="lazy" /><p>{site.about.signature}</p></div></Reveal>
    </div>
  </section>
}

function Areas() {
  return <section id="atuacao" className="section areas-section" aria-labelledby="areas-title">
    <div className="shell">
      <Reveal className="section-heading"><div><SectionLabel>{site.areas.label}</SectionLabel><h2 id="areas-title">{site.areas.title}</h2></div><p className="section-intro">{site.areas.description}</p></Reveal>
      <DragRail label={site.ui.servicesRail} className="services-rail">{site.services.map((service, index) => <Reveal key={service.slug} className="service-card-reveal" delay={index * 0.09}><article className="service-card">
        <div className="service-card-visual"><span className="service-number">{service.number}</span></div>
        <div className="service-card-copy"><p className="service-category">{service.category}</p><h3>{service.shortTitle}</h3><p className="service-description">{service.description}</p><Link className="text-link" to={`/${service.slug}`}>{service.linkLabel}<ArrowUpRight size={20} aria-hidden="true" /></Link></div>
      </article></Reveal>)}</DragRail>
    </div>
  </section>
}

function Attendance() {
  return <section id="atendimento" className="section attendance-section" aria-labelledby="attendance-title">
    <div className="shell">
      <div className="attendance-heading"><Reveal><SectionLabel>{site.attendance.label}</SectionLabel><h2 id="attendance-title">{site.attendance.title}</h2></Reveal><p className="section-intro">{site.attendance.description}</p></div>
      <ol className="steps-grid">{site.attendance.steps.map((step, index) => <li key={step.title}><Reveal delay={index * 0.08} className="step-card"><div className="step-top"><span>0{index + 1}</span></div><div className="step-copy"><h3>{step.title}</h3><p>{step.description}</p></div></Reveal></li>)}</ol>
      <Reveal className="attendance-bottom"><AttendanceLocations /><WhatsAppLink className="button-dark" /></Reveal>
    </div>
  </section>
}

export default function Home() {
  return <><Hero /><About /><Areas /><Attendance /><Faq /><Reviews /><Contact /></>
}
