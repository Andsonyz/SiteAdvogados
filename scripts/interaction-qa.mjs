import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const page = await context.newPage()
await page.addInitScript(() => {
  window.qaEvents = []
  new PerformanceObserver(list => {
    window.qaEvents.push(...list.getEntries().filter(e => e.interactionId).map(e => ({ name: e.name, duration: e.duration, interactionId: e.interactionId })))
  }).observe({ type: 'event', buffered: true, durationThreshold: 16 })
})
await page.goto(process.env.QA_URL || 'http://127.0.0.1:5183/', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Abrir menu' }).tap()
await page.getByRole('navigation').getByRole('link', { name: 'Atendimento', exact: true }).tap()
await page.locator('.step-toggle').first().tap()
await page.getByRole('button', { name: 'O BPC é uma aposentadoria?' }).tap()
const cdp = await context.newCDPSession(page)
const start = await page.evaluate(() => scrollY)
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 180, y: 700 }] })
for (let y = 650; y >= 350; y -= 30) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 180, y }] })
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await page.waitForTimeout(500)
const result = await page.evaluate(before => ({
  entries: window.qaEvents,
  supported: PerformanceObserver.supportedEntryTypes.includes('event'),
  nativeVerticalScroll: scrollY > before + 30,
  note: 'Event Timing in this local interaction sample is not field INP or a Core Web Vitals certification.',
}), start)
await mkdir('output/mobile-redesign', { recursive: true })
await writeFile('output/mobile-redesign/interactions.json', JSON.stringify(result, null, 2))
console.log(result)
await browser.close()
if (!result.nativeVerticalScroll) process.exitCode = 1
