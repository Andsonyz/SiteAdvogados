import { test, expect } from '@playwright/test'

test('new identity replaces the old brand on every route', async ({ page }) => {
  for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
    await page.goto(path)
    for (const parent of ['.site-header .brand', '.site-footer .brand']) {
      const logo = page.locator(`${parent} img`)
      await expect(logo).toBeVisible()
      await expect(logo).toHaveAttribute('alt', 'Iara Santos — Advocacia e Assessoria Jurídica')
      await logo.scrollIntoViewIfNeeded()
      await logo.evaluate((img: HTMLImageElement) => img.decode())
      const result = await logo.evaluate((img: HTMLImageElement) => {
        const r = img.getBoundingClientRect()
        const sourceRatio = Number(img.getAttribute('width')) / Number(img.getAttribute('height'))
        return { src: img.currentSrc, distortion: Math.abs(r.width / r.height - sourceRatio) }
      })
      expect(result.src).toContain('/images/marca-iara-marfim-')
      expect(result.distortion).toBeLessThan(.02)
    }
    await expect(page.locator('img[src*="iara-santos-logo"]')).toHaveCount(0)
  }
  const icon = await page.request.get('/favicon.svg')
  expect(icon.ok()).toBe(true)
  expect(await icon.text()).toContain('<image')
})
