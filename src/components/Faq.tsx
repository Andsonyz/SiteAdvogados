import { useState } from 'react'
import { motion } from 'motion/react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { Plus } from 'lucide-react'
import { artwork, site } from '../data/site'
import { Reveal, SectionLabel } from './Shared'
import Artwork from './Artwork'
import Wave from './Wave'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const reduced = useReducedMotion()
  return <section id="duvidas" className="section faq-section" aria-labelledby="faq-title">
    <div className="shell faq-grid">
      <Reveal><SectionLabel>{site.faq.label}</SectionLabel><h2 id="faq-title">{site.faq.title}</h2><p className="section-intro">{site.faq.description}</p><Artwork asset={artwork.justice} className="faq-statue" depth /></Reveal>
      <Reveal><div className="faq-list">{site.faq.items.map((item, index) => <div className={`faq-item ${open === index ? 'is-open' : ''}`} key={item.question}>
        <h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><motion.span className="faq-indicator" animate={{ rotate: open === index ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}><Plus size={21} aria-hidden="true" /></motion.span></button></h3>
        <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={open !== index} initial={false} animate={{ height: open === index ? 'auto' : 0, opacity: open === index ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.25, ease: 'easeOut' }} className="faq-answer-wrap"><p className="faq-answer">{item.answer}</p></motion.div>
      </div>)}</div><p className="disclaimer">{site.faq.disclaimer}</p></Reveal>
    </div><Wave next="ivory" />
  </section>
}
