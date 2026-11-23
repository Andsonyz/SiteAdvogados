import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const base = process.env.QA_URL || 'http://127.0.0.1:5184'
const output = 'output/identidade-vinho/after'
await mkdir(output, { recursive: true })
const matrix = [[320, 568], [360, 640], [375, 812], [390, 844], [412, 915], [568, 320], [639, 900], [640, 900], [768, 1024], [1024, 900], [1440, 900]]
const routes = [['home', '/'], ['aposentadorias', '/aposentadorias'], ['bpc', '/bpc'], ['404', '/nao-existe']]
const results = [], errors = [], densities = []
let tokens
const hideFixed = '.site-header,.skip-link { visibility: hidden !important; }'
async function load(page, path) {
  await page.goto(base + path)
  await page.locator('.footer-top').waitFor()
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(async img => { img.loading = 'eager'; await img.decode().catch(() => {}) }))
  })
}
for (const [engine, browserType] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await browserType.launch()
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  page.on('pageerror', error => errors.push({ engine, url: page.url(), error: error.message }))
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) errors.push({ engine, url: response.url(), status: response.status() }) })
  for (const [width, height] of matrix) {
    await page.setViewportSize({ width, height })
    for (const [name, path] of routes) {
      await load(page, path)
      const measurement = await page.evaluate(() => {
        const outside = [...document.querySelectorAll('h1,h2,.button,.contact-phone,.footer-professional,.brand,.service-paragraph,.about-copy')].filter(el => {
          const r = el.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1)
        }).map(el => el.className || el.tagName)
        const brandDistortions = [...document.querySelectorAll('.brand-logo,.about-logo')].filter(img => {
          const r = img.getBoundingClientRect(); const ratio = Number(img.getAttribute('width')) / Number(img.getAttribute('height'))
          return Math.abs(r.width / r.height - ratio) > .02
        }).length
        const contactErrors = [...document.querySelectorAll('a[href*="wa.me"]')].filter(el => {
          const url = new URL(el.href)
          return url.origin + url.pathname !== 'https://wa.me/5584981363772' || url.searchParams.get('text') !== 'Olá, Iara! Conheci seu site e gostaria de informações sobre o atendimento.'
        }).length
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          outside, brandDistortions, contactErrors,
          brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc),
          fontsLoaded: document.fonts.check('400 32px Baskervville') && document.fonts.check('600 17px "Manrope Variable"'),
          firstScreenFits: innerWidth !== 360 && innerWidth !== 390 || !document.querySelector('.hero') || ['#hero-title', '.portrait-composition', '.hero-actions .button'].every(selector => {
            const r = document.querySelector(selector).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight
          }),
        }
      })
      results.push({ engine, width, height, path, ...measurement })
      if (name === 'home' || [390, 768, 1440].includes(width)) await page.screenshot({ path: `${output}/${engine}-${name}-${width}.png`, fullPage: true, style: '.skip-link { visibility:hidden!important; }' })
      if (name === 'home' && [390, 768, 1440].includes(width)) {
        for (const selector of ['.hero', '.contact-section', '.site-footer']) await page.locator(selector).screenshot({ path: `${output}/${engine}-${selector.slice(1)}-${width}.png`, style: hideFixed })
      }
      if (name === 'home' && width === 390) {
        tokens = await page.evaluate(() => {
          const css = getComputedStyle(document.documentElement)
          return Object.fromEntries(['wine', 'ivory', 'ink', 'muted', 'light-muted', 'line-on-wine', 'gradient-dark', 'gradient-light', 'gradient-sand'].map(name => [name, css.getPropertyValue(`--${name}`).trim()]))
        })
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.getByRole('button', { name: 'Abrir menu' }).click()
        await page.screenshot({ path: `${output}/${engine}-menu-open-390.png`, style: '.skip-link{visibility:hidden!important}' })
        await page.keyboard.press('Escape')
        for (const toggle of await page.locator('.step-toggle').all()) await toggle.click()
        await page.locator('#atendimento').screenshot({ path: `${output}/${engine}-attendance-open-390.png`, style: hideFixed })
        await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).click()
        await page.locator('#duvidas').screenshot({ path: `${output}/${engine}-faq-open-390.png`, style: hideFixed })
      }
    }
  }
  for (const density of [1, 2, 3]) {
    const device = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: density, reducedMotion: 'reduce' })
    const devicePage = await device.newPage(); await load(devicePage, '/')
    const logo = devicePage.locator('.site-footer .brand-logo'); await logo.scrollIntoViewIfNeeded()
    await logo.screenshot({ path: `${output}/${engine}-brand-${density}x.png`, style: hideFixed })
    densities.push({ engine, density, source: await logo.evaluate(img => img.currentSrc) })
    await device.close()
  }
  await context.close(); await browser.close()
}
const luminance = hex => {
  const values = hex.replace('#', '').match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722
}
const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05)
const dark = tokens['gradient-dark'].match(/#[0-9a-f]{6}/gi)
const light = [...tokens['gradient-light'].match(/#[0-9a-f]{6}/gi), ...tokens['gradient-sand'].match(/#[0-9a-f]{6}/gi)]
const contrast = [
  ['body', tokens.ink, light, 4.5], ['secondary', tokens.muted, light, 4.5],
  ['title-on-dark', tokens.ivory, dark, 4.5], ['secondary-on-dark', tokens['light-muted'], dark, 4.5],
  ['primary-CTA', tokens.wine, [tokens.ivory], 4.5], ['focus-on-light', tokens.wine, light, 3],
  ['focus-on-dark', tokens.ivory, dark, 3], ['control-border', tokens['line-on-wine'], [tokens.wine], 3],
].map(([name, foreground, backgrounds, minimum]) => ({ name, foreground, backgrounds, minimum, worstRatio: Math.min(...backgrounds.map(background => ratio(foreground, background))) }))
const failures = results.filter(r => r.overflow || r.outside.length || r.brokenImages.length || r.brandDistortions || r.contactErrors || !r.fontsLoaded || !r.firstScreenFits)
const contrastFailures = contrast.filter(row => row.worstRatio < row.minimum)
await writeFile(`${output}/report.json`, JSON.stringify({ base, results, errors, densities, tokens, contrast, failures, contrastFailures }, null, 2))
console.log(JSON.stringify({ combinations: results.length, failures, errors, contrastFailures }))
if (failures.length || errors.length || contrastFailures.length) process.exitCode = 1
