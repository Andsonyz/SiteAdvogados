import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.QA_URL || 'http://127.0.0.1:5182'
const output = 'output/alinhamento/after'
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
const metrics = []
for (const width of [320, 390, 639, 640, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  for (const [name, path] of [['home', '/'], ['aposentadorias', '/aposentadorias'], ['bpc', '/bpc'], ['404', '/nao-existe']]) {
    await page.goto(base + path)
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode().catch(() => {}) }))
    })
    await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true })
    metrics.push(await page.evaluate(({ width, path }) => ({
      width, path, overflow: document.documentElement.scrollWidth > innerWidth,
      brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc),
    }), { width, path }))
    if (name === 'home') {
      for (const selector of ['.hero', '.contact-section', '.site-footer']) {
        await page.locator(selector).screenshot({ path: `${output}/${selector.slice(1)}-${width}.png`, style: '.site-header { visibility: hidden !important; }' })
      }
      if (width === 390) {
        for (const toggle of await page.locator('.step-toggle').all()) await toggle.click()
        await page.locator('#atendimento').screenshot({ path: `${output}/attendance-open-390.png`, style: '.site-header { visibility: hidden !important; }' })
      }
    }
  }
}
await browser.close()
await writeFile(`${output}/metrics.json`, JSON.stringify({ base, metrics, errors }, null, 2))
const issues = metrics.filter(row => row.overflow || row.brokenImages.length)
console.log(JSON.stringify({ pagesCaptured: metrics.length, errors, issues }))
if (errors.length || issues.length) process.exitCode = 1
