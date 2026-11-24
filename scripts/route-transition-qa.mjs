import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base = process.env.QA_URL || 'http://127.0.0.1:5189'
const out = process.env.QA_OUTPUT || 'output/route-transition/visual'
await mkdir(out, { recursive: true })
const results = [], errors = []
for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch()
  try {
    const context = await browser.newContext({ reducedMotion: 'no-preference' })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push({ engine, error: error.message }))
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push({ engine, url: response.url(), status: response.status() }) })
    await page.addInitScript(() => {
      window.routeQA = { hold: false, animation: null }
      const original = Element.prototype.animate
      Element.prototype.animate = function (frames, options) {
        const animation = original.call(this, frames, options)
        if (this.classList.contains('route-transition') && window.routeQA.hold) {
          window.routeQA.hold = false
          window.routeQA.animation = animation
          // Freeze an actual animation frame solely to capture its composition reproducibly.
          animation.pause()
          animation.currentTime = 100
        }
        return animation
      }
    })
    const settled = () => page.waitForFunction(() => {
      const node = document.querySelector('.route-transition')
      return node && !node.hasAttribute('data-route-entering') && getComputedStyle(node).transform === 'none'
    })
    const capture = async (label, width, direction) => {
      await page.waitForFunction(() => window.routeQA.animation?.playState === 'paused')
      const state = await page.evaluate(() => ({
        x: new DOMMatrix(getComputedStyle(document.querySelector('.route-transition')).transform).m41,
        overflow: document.documentElement.scrollWidth > innerWidth,
        header: getComputedStyle(document.querySelector('.site-header')).transform,
        footer: getComputedStyle(document.querySelector('.site-footer')).transform,
        duration: window.routeQA.animation.effect.getTiming().duration,
      }))
      assert.ok(state.x * direction > 1)
      assert.equal(state.overflow, false)
      assert.equal(state.header, 'none'); assert.equal(state.footer, 'none'); assert.equal(state.duration, 360)
      await page.screenshot({ path: `${out}/${engine}-${label}-frame-${width}.png` })
      await page.evaluate(() => { window.routeQA.animation.play(); window.routeQA.animation = null })
      await settled()
      await page.screenshot({ path: `${out}/${engine}-${label}-final-${width}.png` })
      results.push({ engine, width, label, ...state })
    }
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height })
      await page.goto(base, { waitUntil: 'networkidle' })
      await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.hero-portrait').decode() })
      await page.screenshot({ path: `${out}/${engine}-home-${width}.png`, fullPage: true })
      await page.evaluate(() => { window.routeQA.hold = true; document.querySelector('a[href="/bpc"]').click() })
      await capture('service-right', width, 1)
      await page.screenshot({ path: `${out}/${engine}-bpc-full-${width}.png`, fullPage: true })
      await page.evaluate(() => { window.routeQA.hold = true; document.querySelector('.back-link').click() })
      await capture('home-left', width, -1)
      const details = await page.evaluate(async () => {
        await Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode() }))
        return {
          brokenImages: [...document.images].filter(img => img.naturalWidth === 0).length,
          phoneFont: getComputedStyle(document.querySelector('.contact-phone')).fontFamily,
          headings: document.querySelectorAll('main h1').length,
        }
      })
      assert.equal(details.brokenImages, 0); assert.equal(details.headings, 1)
      results.push({ engine, width, ...details })
    }
    // A paused animation cannot finish naturally: these checks prove input really cancels it.
    for (const action of ['keyboard', 'pointer', 'wheel', 'resize', 'reduced-motion']) {
      await page.evaluate(() => { window.routeQA.hold = true; document.querySelector('a[href="/bpc"]').click() })
      await page.waitForFunction(() => window.routeQA.animation?.playState === 'paused')
      if (action === 'keyboard') await page.keyboard.press('Tab')
      else if (action === 'pointer') await page.mouse.click(10, 10)
      else if (action === 'wheel') await page.mouse.wheel(0, 100)
      else if (action === 'resize') await page.setViewportSize({ width: 1439, height: 900 })
      else await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.waitForFunction(() => {
        const node = document.querySelector('.route-transition')
        return !node.hasAttribute('data-route-entering') && !node.getAnimations().length && getComputedStyle(node).transform === 'none'
      }, undefined, { timeout: 1500 })
      results.push({ engine, action, interruptedPausedAnimation: true })
      await page.locator('.back-link').evaluate(el => el.click())
      await page.locator('#hero-title').waitFor()
      await settled()
    }
    await context.close()
  } finally { await browser.close() }
}
await writeFile(`${out}/report.json`, JSON.stringify({ results, errors, note: 'Frames intermediários pausados em 100 ms apenas para captura; a suíte testa a execução sem pausa.' }, null, 2))
assert.deepEqual(errors, [])
console.log(JSON.stringify({ captures: results.filter(row => row.label).length, interruptions: results.filter(row => row.action).length, errors: errors.length, output: out }))
