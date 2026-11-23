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

test('wine and ivory identity covers routes and open states', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
    await page.goto(path)
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#653D3D')
    await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(101, 61, 61)')
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(67, 40, 45)')
    if (path === '/') {
      await expect(page.locator('.hero-actions .button')).toHaveCSS('background-color', 'rgb(243, 237, 223)')
      await expect(page.locator('.hero-actions .button')).toHaveCSS('color', 'rgb(101, 61, 61)')
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.getByRole('navigation')).toBeVisible()
      await expect(page.getByRole('navigation').locator('.button')).toHaveCSS('color', 'rgb(243, 237, 223)')
      await page.keyboard.press('Escape')
      await page.locator('.step-toggle').first().click()
      await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).click()
      await expect(page.locator('#faq-answer-1')).toHaveAttribute('aria-hidden', 'false')
    }
    await page.mouse.move(0, 0)
    const oldControls = await page.locator('a,button').evaluateAll(elements => {
      const old = ['rgb(217, 163, 95)', 'rgb(169, 108, 63)', 'rgb(53, 37, 31)']
      return elements.filter(el => {
        const css = getComputedStyle(el)
        return old.includes(css.color) || old.includes(css.backgroundColor)
      }).map(el => el.className)
    })
    expect(oldControls).toEqual([])
  }
})

test('all eight artworks and three attendance illustrations remain available', async ({ page }) => {
  const sources = new Set<string>()
  for (const path of ['/', '/aposentadorias', '/bpc']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (path === '/') for (const toggle of await page.locator('.step-toggle').all()) await toggle.click()
    for (const src of await page.locator('.artwork img').evaluateAll(images => images.map(img => (img as HTMLImageElement).src))) sources.add(new URL(src).pathname)
  }
  for (const name of ['documento-relogio', 'acolhimento', 'conversa', 'livros-caneta', 'balanca', 'martelo', 'justica', 'conjunto-juridico', 'atendimento-contato', 'atendimento-conversa', 'atendimento-documentos']) {
    expect(sources.has(`/images/${name}.webp`), name).toBe(true)
  }
})
