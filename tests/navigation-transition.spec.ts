import { test, expect, type Page } from '@playwright/test'

type Sample = { x: number; overflow: boolean; header: string; footer: string; pages: number; headings: number }
type Entry = { frames: PropertyIndexedKeyframes | Keyframe[] | null; duration: number; samples: Sample[] }
declare global { interface Window { routeEntries: Entry[] } }

async function observeTransitions(page: Page) {
  await page.addInitScript(() => {
    window.routeEntries = []
    const original = Element.prototype.animate
    Element.prototype.animate = function (frames, options) {
      const animation = original.call(this, frames, options)
      if (this.classList.contains('route-transition')) {
        const node = this
        const entry = { frames, duration: Number(animation.effect?.getTiming().duration), samples: [] as Sample[] }
        window.routeEntries.push(entry)
        const sample = () => {
          entry.samples.push({
            x: new DOMMatrix(getComputedStyle(node).transform).m41,
            overflow: document.documentElement.scrollWidth > innerWidth,
            header: getComputedStyle(document.querySelector('.site-header')!).transform,
            footer: getComputedStyle(document.querySelector('.site-footer')!).transform,
            pages: document.querySelectorAll('.route-transition').length,
            headings: document.querySelectorAll('main h1').length,
          })
          if (animation.playState === 'running' || animation.pending) requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      }
      return animation
    }
  })
}

async function settled(page: Page) {
  await expect(page.locator('.route-transition')).toHaveCSS('transform', 'none')
  await expect(page.locator('.route-transition')).not.toHaveAttribute('data-route-entering')
}

async function expectEntry(page: Page, index: number, direction: 1 | -1) {
  await expect.poll(() => page.evaluate(() => window.routeEntries.length)).toBe(index + 1)
  await settled(page)
  const entry = await page.evaluate(index => window.routeEntries[index], index)
  expect(entry.duration).toBe(360)
  expect(entry.samples.some(sample => direction * sample.x > 1)).toBe(true)
  expect(entry.samples.every(sample => !sample.overflow && sample.header === 'none' && sample.footer === 'none' && sample.pages === 1 && sample.headings === 1)).toBe(true)
  await expect(page.locator('#main-content')).toBeFocused()
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await observeTransitions(page)
})

test('service entry comes from the right, cross-service from the right and home from the left', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer aposentadorias', exact: true }).click()
  await expect(page).toHaveURL('/aposentadorias')
  await expectEntry(page, 0, 1)
  await expect(page).toHaveTitle('Aposentadorias | Iara Santos')
  await page.locator('.other-service a').click()
  await expect(page).toHaveURL('/bpc')
  await expectEntry(page, 1, 1)
  await page.locator('.back-link').click()
  await expect(page).toHaveURL('/')
  await expectEntry(page, 2, -1)
  expect(await page.locator('.hero-identity').evaluate(el => el.getAnimations().length)).toBe(0)
})

test('browser Back and Forward follow the visited history order', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer aposentadorias', exact: true }).click()
  await expectEntry(page, 0, 1)
  await page.locator('.other-service a').click()
  await expectEntry(page, 1, 1)
  await page.goBack(); await expect(page).toHaveURL('/aposentadorias'); await expectEntry(page, 2, -1)
  await page.goBack(); await expect(page).toHaveURL('/'); await expectEntry(page, 3, -1)
  await page.goForward(); await expect(page).toHaveURL('/aposentadorias'); await expectEntry(page, 4, 1)
})

test('direct loads, reloads and anchors do not start a page slide', async ({ page }) => {
  for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
    await page.goto(path); await settled(page)
    expect(await page.evaluate(() => window.routeEntries)).toEqual([])
    await page.reload(); await settled(page)
    expect(await page.evaluate(() => window.routeEntries)).toEqual([])
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/bpc')
  await page.getByRole('navigation').getByRole('link', { name: 'Dúvidas', exact: true }).click()
  await expect(page).toHaveURL('/#duvidas'); await settled(page)
  await expect(page.locator('#duvidas')).toBeFocused()
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  expect(await page.evaluate(() => window.routeEntries)).toEqual([])
  const header = (await page.locator('.site-header').boundingBox())!
  expect((await page.locator('#duvidas').boundingBox())!.y).toBeGreaterThanOrEqual(header.height)
})

test('reduced motion skips the slide and live preference changes finish it immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).click(); await settled(page)
  expect(await page.evaluate(() => window.routeEntries)).toEqual([])
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.back-link').evaluate((el: HTMLAnchorElement) => el.click())
  await expect(page.locator('.route-transition')).toHaveAttribute('data-route-entering', 'left')
  await page.emulateMedia({ reducedMotion: 'reduce' }); await settled(page)
  expect(await page.locator('.route-transition').evaluate(el => el.getAnimations().length)).toBe(0)
  await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#faq-question-1')).toHaveAttribute('aria-expanded', 'true')
})

test('keyboard interaction finishes the incoming page without stealing focus later', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).evaluate((el: HTMLAnchorElement) => el.click())
  await expect(page.locator('.route-transition')).toHaveAttribute('data-route-entering', 'right')
  await page.keyboard.press('Tab'); await settled(page)
  await page.evaluate(() => document.activeElement?.setAttribute('data-focus-test', 'kept'))
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => document.activeElement?.getAttribute('data-focus-test'))).toBe('kept')
  expect(await page.locator('.route-transition').evaluate(el => el.getAnimations().length)).toBe(0)
})

test('rapid route changes cancel older animations and keep only the current page', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer aposentadorias', exact: true }).evaluate((el: HTMLAnchorElement) => el.click())
  await expect(page.locator('.service-hero h1')).toHaveText('Aposentadorias')
  await page.locator('.other-service a').evaluate((el: HTMLAnchorElement) => el.click())
  await expect(page.locator('.service-hero h1')).toContainText('Benefício de Prestação Continuada')
  await page.locator('.back-link').evaluate((el: HTMLAnchorElement) => el.click())
  await expect(page.locator('#hero-title')).toBeAttached(); await settled(page); await expect(page).toHaveURL('/')
  await expect(page.locator('main h1')).toHaveCount(1)
  await expect(page.locator('#main-content')).toBeFocused()
  expect(await page.evaluate(() => window.routeEntries.length)).toBe(3)
  expect(await page.locator('.route-transition').evaluate(el => el.getAnimations().length)).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('pointer, wheel and resize finish the transition and preserve the requested action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const action of ['pointer', 'wheel', 'resize']) {
    await page.goto('/')
    await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).evaluate((el: HTMLAnchorElement) => el.click())
    await expect(page.locator('.route-transition')).toHaveAttribute('data-route-entering', 'right')
    if (action === 'pointer') {
      await page.getByRole('button', { name: 'Abrir menu' }).click()
      await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
    } else if (action === 'wheel') {
      await page.mouse.wheel(0, 350)
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)
    } else await page.setViewportSize({ width: 375, height: 812 })
    await settled(page)
    expect(await page.locator('.route-transition').evaluate(el => el.getAnimations().length)).toBe(0)
  }
})

test('a previously unknown history entry is displayed immediately', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    history.pushState({ key: 'before-app-session' }, '', '/bpc')
    dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
  })
  await expect(page).toHaveURL('/bpc'); await settled(page)
  await expect(page.locator('main h1')).toContainText('Benefício de Prestação Continuada')
  expect(await page.evaluate(() => window.routeEntries)).toEqual([])
})

test('visits stay known after leaving and returning through an unknown history entry', async ({ page }) => {
  await page.addInitScript(() => {
    history.replaceState({ key: 'before-session', idx: 0 }, '', '/nao-existe')
    history.pushState({ key: 'session-start', idx: 1 }, '', '/')
  })
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).click()
  await expectEntry(page, 0, 1)
  await page.goBack(); await expect(page).toHaveURL('/'); await expectEntry(page, 1, -1)
  await page.goBack(); await expect(page).toHaveURL('/nao-existe'); await settled(page)
  expect(await page.evaluate(() => window.routeEntries.length)).toBe(2)
  await page.goForward(); await expect(page).toHaveURL('/'); await expect(page.locator('#hero-title')).toBeAttached(); await settled(page)
  await page.goForward(); await expect(page).toHaveURL('/bpc'); await expectEntry(page, 2, 1)
})

test('touch interaction finishes a slide without preventing the mobile menu', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' })
  const page = await context.newPage()
  await observeTransitions(page)
  await page.goto('http://127.0.0.1:4173/')
  await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).tap()
  await page.getByRole('button', { name: 'Abrir menu' }).tap()
  await settled(page)
  await expect(page.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
  await context.close()
})

for (const [width, height] of [[320, 568], [360, 640], [375, 812], [390, 844], [412, 915], [568, 320], [768, 1024], [1440, 900]]) {
  test(`sliding routes keep the viewport intact at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await page.goto('/')
    await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).click()
    await expectEntry(page, 0, 1)
    await page.locator('.back-link').click()
    await expectEntry(page, 1, -1)
    await page.evaluate(async () => { await document.fonts.ready })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('.route-transition')).toHaveCSS('will-change', 'auto')
    if (width === 1440) {
      const section = page.locator('.horizontal-journey')
      await expect(section).toHaveClass(/is-scroll-driven/)
      await section.evaluate(el => {
        const top = parseFloat(getComputedStyle(el).getPropertyValue('--journey-top'))
        scrollTo({ top: el.getBoundingClientRect().top + scrollY - top + 100, behavior: 'instant' })
      })
      await expect.poll(() => section.locator('.rail-viewport').evaluate(el => el.scrollLeft)).toBeGreaterThan(90)
      const top = (await section.locator('.journey-sticky').boundingBox())!.y
      expect(top).toBeGreaterThan(75); expect(top).toBeLessThan(130)
    }
  })
}
