import { test, expect } from '@playwright/test'

test('two services use vertical flow on mobile and tablet and two desktop columns', async ({ page }) => {
  for (const width of [320, 360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 }); await page.goto('/#atuacao')
    const services = page.locator('.services-list > li'); await expect(services).toHaveCount(2)
    const boxes = await services.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()))
    if (width < 1024) expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom)
    else { expect(Math.abs(boxes[1].top - boxes[0].top)).toBeLessThan(2); expect(boxes[1].left).toBeGreaterThan(boxes[0].right) }
    for (const box of boxes) { expect(box.left).toBeGreaterThanOrEqual(0); expect(box.right).toBeLessThanOrEqual(width) }
    await expect(page.locator('#atuacao .rail-viewport')).toHaveCount(0)
    await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).click(); await expect(page).toHaveURL('/bpc')
  }
})

test('empty reviews are omitted from the page and menu', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#avaliacoes')).toHaveCount(0)
  await expect(page.locator('a[href="/#avaliacoes"]')).toHaveCount(0)
  await expect(page.locator('#avaliacoes blockquote')).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText('Ainda não há avaliações publicadas.')
})

test('authorized review fixtures enable section, menu and reusable keyboard rail', async ({ page }) => {
  // Fixtures only in the dev browser. Never added to production content.
  for (const count of [1, 4]) {
    await page.goto('about:blank')
    const fixtures = Array.from({ length: count }, (_, i) => ({ id: `fixture-${i}`, author: `Autoria de teste ${i}`, text: 'Texto de teste da apresentação de uma avaliação autorizada.' }))
    await page.route('**/src/data/site.ts*', async route => {
      const response = await route.fetch()
      await route.fulfill({ response, body: (await response.text()).replace('items: []', `items: ${JSON.stringify(fixtures)}`) })
    })
    await page.setViewportSize({ width: 375, height: 812 }); await page.goto('/#avaliacoes')
    await expect(page.locator('#avaliacoes blockquote')).toHaveCount(count)
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Avaliações', exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
    if (count === 1) await expect(page.locator('#avaliacoes button')).toHaveCount(0)
    else {
      const rail = page.locator('.reviews-rail .rail-viewport'); await rail.focus()
      await page.keyboard.press('End'); await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(100)
      await page.keyboard.press('Home'); await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBe(0)
    }
    await page.unrouteAll()
  }
})

test('attendance details open independently by keyboard and load three illustrations', async ({ page }) => {
  await page.goto('/#atendimento'); const buttons = page.locator('.step-toggle')
  await expect(buttons).toHaveCount(3)
  for (let i = 0; i < 3; i++) {
    const button = buttons.nth(i); await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator(`#step-detail-${i}`)).toBeHidden()
    await button.focus(); await page.keyboard.press(i === 1 ? 'Space' : 'Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const panel = page.locator(`#step-detail-${i}`); await expect(panel).toBeVisible()
    await page.locator('.step-card').nth(i).locator('img').evaluate((img: HTMLImageElement) => img.decode())
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
  }
  await buttons.nth(1).click(); await expect(page.locator('#step-detail-1')).toBeHidden()
  await expect(page.locator('#step-detail-1 a,#step-detail-1 button')).toHaveCount(0)
  await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true'); await expect(buttons.last()).toHaveAttribute('aria-expanded', 'true')
})

test('contact uses loaded Manrope and fits target widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/#contato')
    const number = page.locator('.contact-phone'); await expect(number).toContainText('(84) 98136-3772')
    const style = await number.evaluate(async el => {
      await document.fonts.ready; const css = getComputedStyle(el); const box = el.getBoundingClientRect()
      return { family: css.fontFamily, weight: css.fontWeight, loaded: document.fonts.check('600 24px "Manrope Variable"'), fits: box.left >= 0 && box.right <= innerWidth }
    })
    expect(style.family).toContain('Manrope'); expect(style.weight).toBe('600'); expect(style.loaded && style.fits).toBe(true)
  }
})

test('live reduced motion preference resets artwork and keeps details usable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.goto('/#sobre')
  const art = page.locator('.about-books'); await art.scrollIntoViewIfNeeded(); const box = (await art.boundingBox())!
  await page.mouse.move(box.x + box.width * .9, box.y + box.height * .8)
  await expect.poll(() => art.locator('img').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41))).toBeGreaterThan(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(() => art.locator('img').evaluate(el => getComputedStyle(el).transform)).toBe('none')
  await expect.poll(() => page.locator('.button').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s')
  await page.locator('.step-toggle').first().click(); await expect(page.locator('.step-toggle').first()).toHaveAttribute('aria-expanded', 'true')
})

test('fonts, artwork and browser history load without errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
  const failures: string[] = []; page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://127.0.0.1')) failures.push(r.url()) })
  await page.goto('/'); for (const button of await page.locator('.step-toggle').all()) await button.click()
  for (const image of await page.locator('main img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate((img: HTMLImageElement) => img.decode()) }
  const fonts = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family) })
  expect(fonts.some(f => f.includes('Baskervville'))).toBe(true); expect(fonts.some(f => f.includes('Manrope'))).toBe(true)
  await page.getByRole('link', { name: 'Conhecer aposentadorias', exact: true }).click(); await expect(page).toHaveURL('/aposentadorias')
  await page.goBack(); await expect(page).toHaveURL('/'); expect(errors).toEqual([]); expect(failures).toEqual([])
})

test('portrait sources adapt to density and have a usable failure fallback', async ({ browser }) => {
  const sources: string[] = []
  for (const deviceScaleFactor of [1, 2, 3]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor }); const page = await context.newPage()
    await page.goto('http://127.0.0.1:4173/'); const portrait = page.locator('.hero-portrait'); await portrait.evaluate((img: HTMLImageElement) => img.decode())
    sources.push(await portrait.evaluate((img: HTMLImageElement) => img.currentSrc)); await context.close()
  }
  expect(new Set(sources).size).toBeGreaterThan(1)
  const context = await browser.newContext(); const page = await context.newPage()
  await page.route('**/images/iara-santos-*.webp', route => route.abort()); await page.goto('http://127.0.0.1:4173/')
  await expect(page.locator('.portrait-fallback')).toBeVisible(); await expect(page.locator('.hero-actions .button')).toBeVisible(); await context.close()
})
