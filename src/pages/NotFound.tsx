import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { SectionLabel, WhatsAppLink } from '../components/Shared'

export default function NotFound() {
  return <section className="section not-found"><div className="shell"><SectionLabel>{site.ui.notFoundLabel}</SectionLabel><h1>{site.ui.notFoundTitle}</h1><p>{site.ui.notFoundText}</p><div className="not-found-actions"><Link to="/" className="text-link"><ArrowLeft size={18} aria-hidden="true" />{site.ui.back}</Link><WhatsAppLink className="button-dark" /></div></div></section>
}
