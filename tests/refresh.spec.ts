import { test, expect } from '@playwright/test'

test('service rail supports keyboard and mouse without navigating after drag', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/#atuacao')
  const rail = page.getByRole('region', { name: 'Áreas de atuação — serviços' })
  const viewport = rail.locator('.rail-viewport')
  await expect(rail.getByRole('button', { name: 'Próximo item' })).toBeVisible()
  await viewport.focus()
  await page.keyboard.press('End')
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(100)
  await page.keyboard.press('Home')
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBe(0)
  const box = (await viewport.boundingBox())!
  await page.mouse.move(box.x + box.width - 45, box.y + 140)
  await page.mouse.down()
  await page.mouse.move(box.x + 35, box.y + 140, { steps: 12 })
  await page.mouse.up()
  await expect(page).toHaveURL(/#atuacao$/)
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(80)
  await rail.getByRole('link', { name: 'Conhecer o BPC' }).click()
  await expect(page).toHaveURL('/bpc')
  await page.goBack()
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(rail.getByRole('button', { name: 'Próximo item' })).toBeHidden()
})

test('reviews have a real empty state, social brand icons, and an anchor', async ({ page }) => {
  await page.goto('/#avaliacoes')
  const section = page.locator('#avaliacoes')
  await expect(section).toBeInViewport()
  await expect(section).toContainText('Ainda não há avaliações publicadas.')
  await expect(section.locator('button')).toHaveCount(0)
  await expect(section.locator('blockquote')).toHaveCount(0)
  await expect(page.locator('.floating-contact svg[data-brand="whatsapp"]')).toBeVisible()
  const instagram = page.locator('#contato a[href="https://www.instagram.com/iarasantosadv/"]')
  await expect(instagram.locator('svg[data-brand="instagram"]')).toBeVisible()
  await expect(instagram).toContainText('@iarasantosadv')
})

test('all sections, local fonts, images, waves, and history render without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  const failures: string[] = []
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1')) failures.push(response.url()) })
  await page.goto('/')
  for (const section of await page.locator('main section').all()) {
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  }
  await page.evaluate(() => document.fonts.ready)
  const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))
  expect(fonts.some(font => font.includes('Baskervville'))).toBe(true)
  expect(fonts.some(font => font.includes('Manrope'))).toBe(true)
  for (const img of await page.locator('main img').all()) {
    await img.scrollIntoViewIfNeeded()
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true)
  }
  const waves = page.locator('main .wave-divider')
  expect(await waves.count()).toBeGreaterThanOrEqual(6)
  for (const wave of await waves.all()) {
    await expect(wave).toHaveAttribute('aria-hidden', 'true')
    expect(await wave.evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none')
    expect(await wave.evaluate(el => {
      const next = el.closest('section')!.nextElementSibling!
      return getComputedStyle(el.querySelector('svg')!).fill === getComputedStyle(next).backgroundColor
    })).toBe(true)
  }
  await page.locator('#atuacao').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: 'Conhecer aposentadorias' }).click()
  await expect(page).toHaveURL('/aposentadorias')
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Aposentadorias')
  await page.goBack()
  await expect(page).toHaveURL('/')
  expect(errors).toEqual([])
  expect(failures).toEqual([])
})

test('native touch can swipe the rail and still scroll the page vertically', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/#atuacao')
  const viewport = page.locator('.services-rail .rail-viewport')
  await viewport.scrollIntoViewIfNeeded()
  const box = (await viewport.boundingBox())!
  const y = Math.max(180, box.y + 130)
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y }] })
  for (let x = 275; x >= 60; x -= 25) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => viewport.evaluate(el => el.scrollLeft)).toBeGreaterThan(70)
  await expect(page).toHaveURL(/#atuacao$/)
  const start = await page.evaluate(() => scrollY)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 580 }] })
  for (let touchY = 550; touchY >= 300; touchY -= 30) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y: touchY }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 40)
  await context.close()
})

test('one authorized review stays static and multiple reviews reuse the rail', async ({ page }) => {
  // Browser-only fixtures: never written to production content or the built site.
  for (const count of [1, 4]) {
    await page.goto('about:blank')
    const fixtures = Array.from({ length: count }, (_, index) => ({ id: `fixture-${index}`, author: `Autoria de teste ${index}`, text: 'Conteúdo de teste da apresentação de uma avaliação autorizada.' }))
    await page.route('**/src/data/site.ts*', async route => {
      const response = await route.fetch()
      const source = await response.text()
      await route.fulfill({ response, body: source.replace('items: []', `items: ${JSON.stringify(fixtures)}`) })
    })
    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('/#avaliacoes')
    const section = page.locator('#avaliacoes')
    await expect(section.locator('blockquote')).toHaveCount(count)
    await expect(section).not.toContainText('Ainda não há avaliações publicadas.')
    if (count === 1) await expect(section.locator('button')).toHaveCount(0)
    else await expect(section.getByRole('button', { name: 'Próximo item' })).toBeVisible()
    await page.unrouteAll()
  }
})

test('drag beginning on a service link does not navigate, then a fresh click works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/#atuacao')
  const first = page.getByRole('link', { name: 'Conhecer aposentadorias' })
  await first.scrollIntoViewIfNeeded()
  const box = (await first.boundingBox())!
  await page.mouse.move(box.x + box.width - 8, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(Math.max(25, box.x + box.width - 150), box.y + box.height / 2, { steps: 10 })
  await page.mouse.up()
  await expect(page).toHaveURL(/#atuacao$/)
  await page.getByRole('link', { name: 'Conhecer o BPC' }).click()
  await expect(page).toHaveURL('/bpc')
})

test('a mouse release outside the rail cancels an unfinished gesture', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 })
  await page.goto('/#atuacao')
  const rail = page.locator('.services-rail')
  const viewport = rail.locator('.rail-viewport')
  const box = (await viewport.boundingBox())!
  await page.mouse.move(box.x + 270, box.y + 120)
  await page.mouse.down()
  await page.mouse.move(box.x + 270, 85)
  await page.mouse.up()
  await page.mouse.move(box.x + 30, box.y + 120)
  await expect(rail).not.toHaveClass(/is-dragging/)
  expect(await viewport.evaluate(el => el.scrollLeft)).toBe(0)
})

test('changing the OS motion preference stops depth in the current session', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#sobre')
  const art = page.locator('.about-books')
  const img = art.locator('img')
  const box = (await art.boundingBox())!
  await page.mouse.move(box.x + box.width - 10, box.y + box.height - 10)
  await expect.poll(() => img.evaluate(el => getComputedStyle(el).transform)).not.toBe('none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.mouse.move(box.x + 10, box.y + 10)
  await expect.poll(() => img.evaluate(el => getComputedStyle(el).transform)).toBe('none')
})

test('service cards elevate after their reveal and stay steady during drag', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#atuacao')
  const card = page.locator('.service-card').first()
  await card.hover()
  await expect.poll(() => card.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBeLessThan(-2)
  await page.setViewportSize({ width: 375, height: 900 })
  const viewport = page.locator('.services-rail .rail-viewport')
  const box = (await viewport.boundingBox())!
  await page.mouse.move(box.x + 270, box.y + 120)
  await page.mouse.down()
  await page.mouse.move(box.x + 80, box.y + 120, { steps: 8 })
  expect(await card.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m42)).toBe(0)
  await page.mouse.up()
})
