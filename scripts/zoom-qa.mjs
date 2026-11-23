import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.QA_URL || 'http://127.0.0.1:5183'
const out = process.env.QA_OUTPUT || 'output/mobile-redesign/zoom'
await mkdir(out, { recursive: true })
// Isolated QA profile: changes Chrome's real default page zoom, not CSS zoom or text size.
const context = await chromium.launchPersistentContext(`${out}-profile`, {
  channel: 'chromium', headless: true, viewport: null, args: ['--window-size=1280,900'],
})
const results = []
try {
  const settings = context.pages()[0]
  await settings.goto('chrome://settings/appearance')
  await settings.locator('#zoomLevel').selectOption('4')
  const page = await context.newPage()
  for (const route of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    results.push({ route, ...await page.evaluate(() => ({
      innerWidth, outerWidth, devicePixelRatio,
      overflow: document.documentElement.scrollWidth > innerWidth,
      rootFont: getComputedStyle(document.documentElement).fontSize,
    })) })
    if (route === '/') {
      for (const button of await page.locator('.step-toggle').all()) await button.click()
      await page.locator('#atendimento').screenshot({ path: `${out}/attendance-400.png` })
      await page.evaluate(() => scrollTo(0, 0))
    }
    await page.screenshot({ path: `${out}/${route.slice(1) || 'home'}-400.png`, fullPage: true })
  }
  await settings.locator('#zoomLevel').selectOption('1')
} finally { await context.close() }
await writeFile(`${out}/report.json`, JSON.stringify(results, null, 2))
console.log(results)
if (results.some(row => row.overflow || row.innerWidth > 330)) process.exitCode = 1
