import { test, expect } from '@playwright/test'

test('mobile contact and footer stay centered and CTA labels use the button center', async ({ page }) => {
  test.setTimeout(90000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 360, 390, 568, 639, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/aposentadorias', '/bpc']) {
      await page.goto(path)
      await expect(page.locator('.footer-top')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      const result = await page.evaluate(() => {
        const center = (el: Element) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 }
        const contact = document.querySelector('.contact-grid')!
        const footer = document.querySelector('.footer-top')!
        const brand = footer.querySelector('.brand-footer')!.getBoundingClientRect()
        const professional = footer.querySelector('.footer-professional')!.getBoundingClientRect()
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          labelOffsets: [...document.querySelectorAll('.button:not(.button-header)')].map(el => Math.abs(center(el) - center(el.querySelector('span')!))),
          contactOffsets: ['.contact-phone', '.instagram-link', '.contact-art'].map(selector => Math.abs(center(contact) - center(document.querySelector(selector)!))),
          footerOffset: Math.abs(center(footer) - (Math.min(brand.left, professional.left) + Math.max(brand.right, professional.right)) / 2),
          socialOffset: Math.abs(center(footer) - center(footer.querySelector('.footer-social')!)),
          headingAlign: getComputedStyle(document.querySelector('.contact-heading')!).textAlign,
          copyrightAlign: getComputedStyle(document.querySelector('.footer-bottom')!).textAlign,
          proseAlign: getComputedStyle(document.querySelector('.about-copy, .service-paragraph')!).textAlign,
        }
      })
      expect(result.overflow, `${path} at ${width}px`).toBe(false)
      for (const offset of result.labelOffsets) expect(offset).toBeLessThan(1)
      if (width < 640) {
        for (const offset of result.contactOffsets) expect(offset).toBeLessThan(1)
        expect(result.footerOffset).toBeLessThan(1)
        expect(result.socialOffset).toBeLessThan(1)
        expect(result.headingAlign).toBe('center')
        expect(result.copyrightAlign).toBe('center')
      } else expect(result.headingAlign).toBe('left')
      expect(result.proseAlign).not.toBe('center')
      if (path === '/aposentadorias' && width < 1024) {
        const offset = await page.locator('.service-detail-art').evaluate(el => {
          const r = el.getBoundingClientRect(), parent = el.parentElement!.getBoundingClientRect()
          return Math.abs(r.left + r.width / 2 - parent.left - parent.width / 2)
        })
        expect(offset).toBeLessThan(1)
      }
    }
  }
})
