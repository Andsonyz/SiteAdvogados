import { chromium } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const baseURL = process.env.QA_URL || 'http://127.0.0.1:5173'
const browser = await chromium.launch()
await mkdir('output/qa/final', { recursive: true })
const report = []
for (const width of [375, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  const errors = [], failed = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(baseURL)) failed.push(response.url()) })
  for (const route of ['/', '/aposentadorias', '/bpc']) {
    await page.goto(baseURL + route)
    await page.evaluate(() => document.fonts.ready)
    // Walk the complete page to load lazy art and activate each one-time reveal.
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 600) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y)
      await page.waitForTimeout(120)
    }
    await page.waitForFunction(() => [...document.querySelectorAll('main img')].every(img => img.complete && img.naturalWidth > 0))
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForFunction(() => getComputedStyle(document.querySelector('h1')).opacity === '1')
    const name = route === '/' ? 'home' : route.slice(1)
    await page.screenshot({ path: `output/qa/final/${name}-${width}.png`, fullPage: true })
    if (route === '/') {
      await page.screenshot({ path: `output/qa/final/hero-${width}.png` })
      for (const id of ['sobre', 'atuacao', 'atendimento', 'duvidas', 'avaliacoes', 'contato']) {
        await page.locator(`#${id}`).screenshot({ path: `output/qa/final/${id}-${width}.png` })
      }
    }
    report.push({ route, width, ...await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      fonts: [...document.fonts].filter(font => font.status === 'loaded').map(font => ({ family: font.family, weight: font.weight })),
      bodySize: getComputedStyle(document.body).fontSize,
      heading: getComputedStyle(document.querySelector('h1')).fontFamily,
      brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
      waves: [...document.querySelectorAll('.wave-divider')].map(wave => {
        const next = wave.closest('section').nextElementSibling
        return { fill: getComputedStyle(wave.querySelector('svg')).fill, next: next?.id, nextBackground: next ? getComputedStyle(next).backgroundColor : null }
      }),
    })), errors: [...errors], failed: [...failed] })
  }
  await page.close()
}
if (!process.argv.includes('--skip-alpha')) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${baseURL}/output/qa/alpha-comparison.html`)
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth > 0))
  const inventory = JSON.parse(await readFile('assets/inventory.json', 'utf8'))
  for (let index = 0; index < inventory.length; index++) await page.locator('article').nth(index).screenshot({ path: `output/qa/final/alpha-${inventory[index].id}.png` })
  for (const [offset, name] of ['iara-santos', 'iara-santos-logo'].entries()) await page.locator('article').nth(inventory.length + offset).screenshot({ path: `output/qa/final/alpha-${name}.png` })
}
await writeFile('output/qa/final/report.json', JSON.stringify(report, null, 2))
console.log(JSON.stringify(report.map(({ route, width, overflow, brokenImages, errors, failed, bodySize }) => ({ route, width, overflow, brokenImages, errors, failed, bodySize }))))
await browser.close()
