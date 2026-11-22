import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site, whatsappUrl } from './src/data/site.ts'

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)

export default defineConfig({ server: { watch: { ignored: ['**/output/**', '**/test-results/**', '**/playwright-report/**'] } }, plugins: [react(), tailwindcss(), {
  name: 'site-metadata',
  transformIndexHtml(html) {
    const replacements: Record<string, string> = {
      SITE_TITLE: site.seo.title,
      SITE_DESCRIPTION: site.seo.description,
      WHATSAPP_URL: whatsappUrl,
      PHONE: site.contact.phone,
      NAME: site.professional.name,
    }
    const portrait = site.professional.portrait
    const preload = `<link rel="preload" as="image" href="${escapeHtml(portrait.src)}" imagesrcset="${escapeHtml(portrait.srcSet ?? '')}" imagesizes="${escapeHtml(portrait.sizes ?? '')}" fetchpriority="high" />`
    return html.replace('</head>', `${preload}</head>`).replace(/__([A-Z_]+)__/g, (match, key: string) => key in replacements ? escapeHtml(replacements[key]) : match)
  },
}] })
