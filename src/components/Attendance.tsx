import { useState } from 'react'
import Plus from 'lucide-react/icons/plus'
import { artwork, site } from '../data/site'
import Artwork from './Artwork'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from './Shared'

export default function Attendance() {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  function toggle(index: number) {
    setExpanded(previous => {
      const next = new Set(previous)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }
  return <section id="atendimento" className="section attendance-section" aria-labelledby="attendance-title">
    <div className="shell">
      <div className="attendance-heading"><Reveal><SectionLabel>{site.attendance.label}</SectionLabel><h2 id="attendance-title">{site.attendance.title}</h2></Reveal><div className="attendance-illustrated"><p className="section-intro">{site.attendance.description}</p><Artwork asset={artwork.conversation} className="conversation-art" /></div></div>
      <ol className="steps-grid">{site.attendance.steps.map((step, index) => {
        const open = expanded.has(index)
        return <li className={`step-card ${open ? 'is-open' : ''}`} key={step.title}>
          <span className="step-number" aria-hidden="true">0{index + 1}</span>
          <Artwork asset={step.illustration} className="step-illustration" depth />
          <div className="step-copy"><h3>{step.title}</h3><p>{step.summary}</p>
            <button className="step-toggle" type="button" id={`step-toggle-${index}`} aria-expanded={open} aria-controls={`step-detail-${index}`} aria-label={`${open ? site.attendance.collapseLabel : site.attendance.expandLabel}: ${step.title}`} onClick={() => toggle(index)}>
              <span>{open ? site.attendance.collapseLabel : site.attendance.expandLabel}</span><Plus size={18} aria-hidden="true" />
            </button>
            <div className="step-detail" id={`step-detail-${index}`} role="region" aria-labelledby={`step-toggle-${index}`} hidden={!open}>
              {open && <p>{step.detail}</p>}
            </div>
          </div>
        </li>
      })}</ol>
      <div className="attendance-bottom"><AttendanceLocations /><WhatsAppLink className="button-dark" /></div>
    </div>
  </section>
}
