import type { SVGProps } from 'react'

// Local brand marks keep the recognizable phone/tail and camera shapes without another icon package.
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" data-brand="whatsapp" {...props}>
    <path d="M12.04 2a9.92 9.92 0 0 0-8.6 14.88L2 22l5.25-1.38A9.94 9.94 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 1 1 6.98 3.86Z" />
    <path d="M9.02 6.96c-.2-.44-.4-.45-.59-.46h-.5c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.16 1.76 2.81 4.35 3.83 2.15.85 2.59.68 3.06.64.46-.04 1.5-.61 1.71-1.2.21-.59.21-1.1.15-1.2-.06-.11-.23-.17-.48-.3l-1.73-.82c-.23-.09-.4-.13-.57.13-.17.25-.65.82-.8.99-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.38.11-.51.11-.11.25-.3.38-.44.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.44Z" />
  </svg>
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" data-brand="instagram" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.1" /><circle cx="17.5" cy="6.6" r=".9" fill="currentColor" stroke="none" />
  </svg>
}
