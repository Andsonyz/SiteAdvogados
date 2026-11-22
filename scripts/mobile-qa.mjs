import { chromium, webkit, expect } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.QA_URL || 'http://127.0.0.1:5183'
const out = 'output/mobile-redesign/final'
await mkdir(out, { recursive: true })
const results = []
const sizes = [[320, 568], [360, 640], [375, 812], [390, 844], [412, 915], [568, 320], [768, 1024], [1440, 900]]
for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch()
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 1024 })
    for (const route of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
      const errors = []
      const onError = error => errors.push(error.message)
      page.on('pageerror', onError)
      await page.goto(base + route, { waitUntil: 'networkidle' })
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded()
        try { await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0), { timeout: 15000 }).toBe(true) } catch { errors.push(await image.getAttribute('src')) }
      }
      await page.evaluate(() => { scrollTo({ top: 0, behavior: 'instant' }); return document.fonts.ready })
      const collapsedPageHeight = await page.evaluate(() => document.body.scrollHeight)
      const name = `${engine}-${route.slice(1) || 'home'}-${width}`
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
      if (route === '/') {
        await page.screenshot({ path: `${out}/${engine}-hero-${width}.png` })
        if (width === 390 || width === 1440) {
          for (const button of await page.locator('.step-toggle').all()) await button.click()
          await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).click()
          for (const image of await page.locator('.step-illustration img').all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true) }
          await page.locator('#atendimento').screenshot({ path: `${out}/${engine}-attendance-open-${width}.png`, style: '.site-header,.skip-link { visibility: hidden !important; }' })
          await page.locator('#duvidas').screenshot({ path: `${out}/${engine}-faq-open-${width}.png`, style: '.site-header,.skip-link { visibility: hidden !important; }' })
        }
      }
      results.push({ engine, route, width, height, errors, collapsedPageHeight, ...(await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        pageHeight: document.body.scrollHeight,
        backgrounds: [...document.querySelectorAll('main section')].map(e => ({ id: e.id, background: getComputedStyle(e).backgroundImage })),
        title: document.title,
      }))) })
      page.off('pageerror', onError)
    }
    await page.close()
  }
  for (const deviceScaleFactor of [1, 2, 3]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor, reducedMotion: 'reduce' })
    await page.goto(base, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${out}/${engine}-density-${deviceScaleFactor}.png` })
    console.log('density', engine, deviceScaleFactor, await page.locator('.hero-portrait').evaluate(img => img.currentSrc))
    await page.close()
  }
  await browser.close()
}
await writeFile(`${out}/report.json`, JSON.stringify(results, null, 2))
const failed = results.filter(row => row.overflow || row.errors.length)
console.log(JSON.stringify({ combinations: results.length, failed }, null, 2))
if (failed.length) process.exitCode = 1
