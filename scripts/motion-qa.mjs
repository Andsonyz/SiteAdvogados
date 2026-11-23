import { chromium, webkit } from 'playwright'
import { mkdir, writeFile, rename } from 'node:fs/promises'
import assert from 'node:assert/strict'

const base = process.env.QA_URL || 'http://127.0.0.1:5187'
const output = 'output/motion-refresh/motion'
await mkdir(output, { recursive: true })
const results = []
for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await type.launch()
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'no-preference',
      ...(engine === 'chromium' && width === 390 ? { recordVideo: { dir: output, size: { width: 390, height: 844 } } } : {}) })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base)
    await page.locator('.hero-actions .button').waitFor()
    await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.hero-portrait').decode() })
    await page.evaluate(() => Promise.all(document.getAnimations().map(a => a.finished.catch(() => {}))))
    await page.screenshot({ path: `${output}/${engine}-opening-${width}.png` })
    await page.mouse.wheel(0, 650)
    await page.waitForFunction(() => window.scrollY > 200)
    await page.locator('#atendimento').scrollIntoViewIfNeeded()
    for (const image of await page.locator('.step-illustration img').all()) await image.evaluate(img => img.decode())
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.attendance-heading > div:first-child')).opacity === '1')
    await page.locator('#atendimento').screenshot({ path: `${output}/${engine}-attendance-closed-${width}.png`, animations: 'disabled' })
    await page.locator('.step-toggle').first().click()
    await page.waitForFunction(() => {
      const actual = new DOMMatrix(getComputedStyle(document.querySelector('.scroll-progress-fill')).transform).m11
      return Math.abs(actual - scrollY / (document.documentElement.scrollHeight - innerHeight)) < .001
    })
    const progress = await page.evaluate(() => {
      const fill = document.querySelector('.scroll-progress-fill')
      return { expected: scrollY / (document.documentElement.scrollHeight - innerHeight), actual: new DOMMatrix(getComputedStyle(fill).transform).m11 }
    })
    assert(Math.abs(progress.expected - progress.actual) < .02)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForFunction(() => document.getAnimations().every(a => a.playState !== 'running'))
    const running = await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)
    assert.equal(running, 0)
    assert.deepEqual(errors, [])
    results.push({ engine, width, progress, runningAfterReduction: running, errors })
    const video = page.video()
    await context.close()
    if (video) await rename(await video.path(), `${output}/mobile-demo.webm`)
  }
  const large = await browser.newPage({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' })
  await large.goto(base + '/#atendimento')
  await large.locator('.step-card').first().waitFor()
  await large.evaluate(() => { document.documentElement.style.fontSize = '200%' })
  await large.locator('.step-card').first().screenshot({ path: `${output}/${engine}-attendance-text200.png`, style: '.site-header {visibility:hidden!important}' })
  await large.close()
  await browser.close()
}
await writeFile(`${output}/report.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results))
