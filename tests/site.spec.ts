import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('WhatsApp preserves number and message on every page without unconfirmed OAB', async ({ page }) => {
  for (const path of ['/', '/aposentadorias', '/bpc']) {
    await page.goto(path); const links = page.locator('a[href*="wa.me"]'); expect(await links.count()).toBeGreaterThan(2)
    for (const link of await links.all()) {
      const url = new URL((await link.getAttribute('href'))!)
      expect(url.origin + url.pathname).toBe('https://wa.me/5584981363772')
      expect(url.searchParams.get('text')).toBe('Olá, Iara! Conheci seu site e gostaria de informações sobre o atendimento.')
    }
    await expect(page.locator('body')).not.toContainText(/OAB/)
  }
})

test('FAQ supports Enter and Space with correct accessible states', async ({ page }) => {
  await page.goto('/#duvidas'); const q = page.getByRole('button', { name: 'O BPC é uma aposentadoria?' })
  await q.focus(); await page.keyboard.press('Enter'); await expect(q).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#faq-answer-1')).toHaveAttribute('aria-hidden', 'false')
  await page.keyboard.press('Space'); await expect(q).toHaveAttribute('aria-expanded', 'false')
})

test('menu closes on Escape, restores focus and anchors clear the sticky header', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 }); await page.goto('/')
  const toggle = page.getByRole('button', { name: /Abrir menu|Fechar menu/ })
  const brand = (await page.locator('.site-header .brand').boundingBox())!, action = (await page.locator('.header-whatsapp').boundingBox())!
  expect(brand.x + brand.width).toBeLessThanOrEqual(action.x)
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true'); await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused(); await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await toggle.click()
  await page.getByRole('navigation').getByRole('link', { name: 'Sobre', exact: true }).click()
  await expect(page).toHaveURL(/#sobre$/); await expect(toggle).toHaveAttribute('aria-expanded', 'false'); await expect(page.locator('#sobre')).toBeFocused()
  const header = (await page.locator('.site-header').boundingBox())!, target = (await page.locator('#sobre').boundingBox())!
  expect(target.y).toBeGreaterThanOrEqual(header.height)
})

test('service URLs support direct loading, reloading and 404 recovery', async ({ page }) => {
  for (const [path, title] of [['/aposentadorias', 'Aposentadorias'], ['/bpc', 'Benefício de Prestação Continuada']]) {
    await page.goto(path); await page.reload(); await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).first().click(); await expect(page).toHaveURL('/')
  }
  await page.goto('/nao-existe'); await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vamos encontrar o caminho de volta.')
  await page.getByRole('link', { name: 'Voltar ao início', exact: true }).click(); await expect(page).toHaveURL('/')
})

test('short landscape menu scrolls to contact', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 }); await page.goto('/'); await page.getByRole('button', { name: 'Abrir menu' }).click()
  const contact = page.getByRole('navigation').getByRole('link', { name: 'Entre em contato' }); await contact.focus()
  const box = (await contact.boundingBox())!; expect(box.y + box.height).toBeLessThanOrEqual(320)
})

for (const [width, height] of [[360, 640], [390, 844]]) {
  test(`first screen includes name, face area and contact at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await page.goto('/'); await page.evaluate(() => document.fonts.ready)
    for (const selector of ['#hero-title', '.portrait-composition', '.hero-actions .button']) {
      const box = (await page.locator(selector).boundingBox())!
      expect(box.y).toBeGreaterThanOrEqual(0); expect(box.y + box.height).toBeLessThanOrEqual(height)
      expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(width)
    }
    const title = (await page.locator('#hero-title').boundingBox())!, portrait = (await page.locator('.portrait-composition').boundingBox())!
    expect(title.x + title.width).toBeLessThanOrEqual(portrait.x)
    expect((await page.locator('.hero-actions .button').boundingBox())!.width).toBeGreaterThanOrEqual(width - 42)
  })
}

test('text at 200 percent reflows and keeps all expanded details accessible', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
      await page.goto(path); await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      if (path === '/') {
        for (const button of await page.locator('.step-toggle').all()) await button.click()
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
    }
  }
})

for (const [width, height] of [[320, 568], [360, 640], [375, 812], [390, 844], [412, 915], [568, 320], [768, 1024], [1440, 900]]) {
  test(`layout and axe ${width}x${height}`, async ({ page }) => {
    test.setTimeout(120000); await page.setViewportSize({ width, height }); await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
      await page.goto(path); await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      expect(results.violations).toEqual([])
    }
  })
}

test('touch menu, FAQ and attendance work without hover; targets remain comfortable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await context.newPage(); await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('button', { name: 'Abrir menu' }).tap()
  await page.getByRole('navigation').getByRole('link', { name: 'Atendimento', exact: true }).tap()
  await expect(page).toHaveURL(/#atendimento$/)
  await page.locator('.step-toggle').first().tap(); await expect(page.locator('.step-toggle').first()).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).tap()
  await expect(page.locator('#faq-question-1')).toHaveAttribute('aria-expanded', 'true')
  const small = await page.locator('a,button').evaluateAll(elements => elements.filter(el => {
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.classList.contains('skip-link') && (r.width < 43.9 || r.height < 43.9)
  }).map(el => ({ text: el.textContent, className: el.className })))
  expect(small).toEqual([]); await context.close()
})

test('keyboard focus remains visible through the entire page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/')
  await page.locator('.skip-link').focus()
  for (let index = 0; index < 22; index++) {
    await page.keyboard.press('Tab')
    const focus = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement; const r = el.getBoundingClientRect(); const css = getComputedStyle(el)
      return { name: el.textContent?.trim(), body: el === document.body, header: !!el.closest('.site-header'), skip: el.classList.contains('skip-link'), top: r.top, bottom: r.bottom, outline: css.outlineStyle, headerBottom: document.querySelector('.site-header')!.getBoundingClientRect().bottom }
    })
    if (focus.body || focus.skip) continue
    expect(focus.outline).not.toBe('none')
    if (!focus.header) { expect(focus.bottom).toBeGreaterThan(focus.headerBottom); expect(focus.top).toBeLessThan(844) }
  }
})
