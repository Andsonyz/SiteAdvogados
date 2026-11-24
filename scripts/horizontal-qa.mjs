import { chromium, webkit } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base = process.env.QA_URL || 'http://127.0.0.1:4173'
const out = process.env.QA_OUTPUT || 'output/formal-horizontal/interactions'
await mkdir(out, { recursive: true })
const results = [], errors = []
async function ready(page, path = '/') {
  await page.goto(base + path)
  await page.locator('.footer-top').waitFor()
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
  await page.waitForLoadState('networkidle')
}
for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch()
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push({ engine, error: error.message }))
    await ready(page)
    const section = page.locator('.horizontal-journey'), rail = section.locator('.rail-viewport')
    assert.match(await section.getAttribute('class'), /is-scroll-driven/)
    const geometry = await section.evaluate(el => {
      const rail = el.querySelector('.rail-viewport')
      const top = parseFloat(getComputedStyle(el).getPropertyValue('--journey-top'))
      return { start: el.getBoundingClientRect().top + scrollY - top, distance: rail.scrollWidth - rail.clientWidth, top }
    })
    for (const [index, fraction] of [0, .5, 1].entries()) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geometry.start + geometry.distance * fraction)
      await page.waitForFunction(target => Math.abs(document.querySelector('.journey-rail .rail-viewport').scrollLeft - target) < 4, geometry.distance * fraction)
      for (const img of await section.locator('img').all()) await img.evaluate(async el => { el.loading = 'eager'; await el.decode() })
      await page.screenshot({ path: `${out}/${engine}-desktop-panel-${index + 1}.png`, animations: 'disabled' })
    }
    await page.mouse.wheel(0, 350)
    await page.waitForFunction(top => document.querySelector('.journey-sticky').getBoundingClientRect().top < top - 100, geometry.top)
    await page.mouse.wheel(0, -850)
    await page.waitForFunction(max => document.querySelector('.journey-rail .rail-viewport').scrollLeft < max - 200, geometry.distance)
    results.push({ engine, check: 'desktop-wheel-exit-and-reverse', passed: true })
    for (const id of ['sobre', 'atuacao', 'atendimento', 'duvidas']) {
      await ready(page, `/#${id}`)
      const position = await page.locator(`#${id}`).evaluate(el => ({ top: el.getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().height }))
      assert.ok(position.top >= position.header - 2 && position.top < position.header + 80, `Direct #${id}: ${JSON.stringify(position)}`)
      results.push({ engine, check: `direct-anchor-${id}`, ...position, passed: true })
    }
    await page.setViewportSize({ width: 1440, height: 500 })
    await ready(page, '/#principios')
    await page.waitForFunction(() => !document.querySelector('.horizontal-journey').classList.contains('is-scroll-driven'))
    results.push({ engine, check: 'short-window-native-fallback', passed: true })
    await context.close()

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce', ...(engine === 'chromium' ? { isMobile: true } : {}) })
    const phone = await mobile.newPage()
    phone.on('pageerror', error => errors.push({ engine, error: error.message }))
    await ready(phone, '/#principios')
    const phoneRail = phone.locator('.journey-rail .rail-viewport')
    for (let i = 1; i <= 3; i++) {
      await phone.screenshot({ path: `${out}/${engine}-mobile-panel-${i}.png` })
      if (i < 3) await phone.getByRole('button', { name: 'Próximo item', exact: true }).tap()
    }
    await phoneRail.focus(); await phone.keyboard.press('Home')
    if (engine === 'chromium') {
      const cdp = await mobile.newCDPSession(phone), box = await phoneRail.boundingBox()
      const y = Math.max(130, Math.min(650, box.y + box.height * .5))
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 315, y }] })
      for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 315 - i * 24, y }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await phone.waitForFunction(() => document.querySelector('.journey-rail .rail-viewport').scrollLeft > 100)
      const before = await phone.evaluate(() => scrollY)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 600 }] })
      for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 600 - i * 25 }] })
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await phone.waitForFunction(y => scrollY > y + 100, before)
      results.push({ engine, check: 'native-emulated-touch-horizontal-and-vertical', passed: true })
    }
    assert.ok(await phone.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    results.push({ engine, check: 'mobile-touch-controls-and-width', passed: true })
    await mobile.close()
  } catch (error) { errors.push({ engine, error: error.stack }) }
  finally { await browser.close() }
}
await writeFile(`${out}/report.json`, JSON.stringify({ base, results, errors }, null, 2))
console.log(JSON.stringify({ results, errors }))
if (errors.length) process.exitCode = 1
