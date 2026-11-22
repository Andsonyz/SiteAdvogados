import { useState } from 'react'
import { Plus } from 'lucide-react'
import { m as motion } from 'motion/react'
import { artwork, site } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Artwork from './Artwork'
import { AttendanceLocations, Reveal, SectionLabel, WhatsAppLink } from './Shared'

export default function Attendance() {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const reduced = useReducedMotion()
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
          <div className="step-copy"><h3>{step.title}</h3><p>{step.summary}</p>
            <button className="step-toggle" type="button" id={`step-toggle-${index}`} aria-expanded={open} aria-controls={`step-detail-${index}`} aria-label={`${open ? site.attendance.collapseLabel : site.attendance.expandLabel}: ${step.title}`} onClick={() => toggle(index)}>
              <span>{open ? site.attendance.collapseLabel : site.attendance.expandLabel}</span><Plus size={18} aria-hidden="true" />
            </button>
            <motion.div className="step-detail" id={`step-detail-${index}`} role="region" aria-labelledby={`step-toggle-${index}`} hidden={!open} initial={false} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.25 }}>
              {open && <><Artwork asset={step.illustration} className="step-illustration" /><p>{step.detail}</p></>}
            </motion.div>
          </div>
        </li>
      })}</ol>
      <div className="attendance-bottom"><AttendanceLocations /><WhatsAppLink className="button-dark" /></div>
    </div>
  </section>
}
