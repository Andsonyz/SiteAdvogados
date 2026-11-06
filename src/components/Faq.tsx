import { useState } from 'react'
import { Plus } from 'lucide-react'
import { site } from '../data/site'
import { Reveal, SectionLabel } from './Shared'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  return <section id="duvidas" className="section faq-section" aria-labelledby="faq-title">
    <div className="shell faq-grid">
      <Reveal><SectionLabel>{site.faq.label}</SectionLabel><h2 id="faq-title">{site.faq.title}</h2><p className="section-intro">{site.faq.description}</p></Reveal>
      <Reveal>
        <div className="faq-list">
          {site.faq.items.map((item, index) => <div className={`faq-item ${open === index ? 'is-open' : ''}`} key={item.question}>
            <h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`}
              onClick={() => setOpen(open === index ? null : index)}>
              <span>{item.question}</span><Plus size={20} aria-hidden="true" />
            </button></h3>
            <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index}>
              <p className="faq-answer">{item.answer}</p>
            </div>
          </div>)}
        </div>
        <p className="disclaimer">{site.faq.disclaimer}</p>
      </Reveal>
    </div>
  </section>
}
