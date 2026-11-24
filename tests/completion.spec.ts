import { test, expect } from '@playwright/test'

test('text and controls remain inside the viewport even when page overflow is clipped', async ({ page }) => {
  test.setTimeout(120000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const [width, height] of [[320, 568], [360, 640], [375, 812], [390, 844], [412, 915], [568, 320], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height })
    for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
      await page.goto(path)
      await page.locator('main h1').waitFor()
      for (const scale of [100, 200]) {
        await page.evaluate(async scale => {
          document.documentElement.style.fontSize = `${scale}%`
          await document.fonts.ready
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
        }, scale)
        const outside = await page.evaluate(() => {
          const result: { text: string; left: number; right: number }[] = []
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          let node: Node | null
          while ((node = walker.nextNode())) {
            if (!node.textContent?.trim() || !node.parentElement) continue
            // Native horizontal panels and intentionally hidden/accessibility-only content are separate layouts.
            if (node.parentElement.closest('script,style,noscript,[hidden],[aria-hidden="true"],.sr-only,.skip-link,.rail-viewport')) continue
            const range = document.createRange()
            range.selectNodeContents(node)
            for (const rect of range.getClientRects()) {
              if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)) result.push({ text: node.textContent.trim().slice(0, 100), left: rect.left, right: rect.right })
            }
          }
          for (const el of document.querySelectorAll('a,button')) {
            if (el.closest('.skip-link,.rail-viewport,[aria-hidden="true"],[hidden]')) continue
            const rect = el.getBoundingClientRect()
            if (rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)) result.push({ text: el.textContent?.trim().slice(0, 100) || el.getAttribute('aria-label') || el.tagName, left: rect.left, right: rect.right })
          }
          return result
        })
        expect(outside, `${path}, ${width}x${height}, text ${scale}%`).toEqual([])
      }
    }
  }
})

test('WhatsApp still opens the correct isolated tab while an incoming page is paused', async ({ page, context }) => {
  // Intercept the destination before opening: this test never accesses WhatsApp or sends a message.
  await context.route('https://wa.me/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Contato em teste</title>' }))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    const original = Element.prototype.animate
    Element.prototype.animate = function (frames, options) {
      const animation = original.call(this, frames, options)
      if (this.classList.contains('route-transition')) { animation.pause(); animation.currentTime = 100 }
      return animation
    }
  })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  await page.getByRole('link', { name: 'Conhecer o BPC', exact: true }).click()
  await expect(page).toHaveURL('/bpc')
  await expect(page.locator('.route-transition')).toHaveAttribute('data-route-entering', 'right')
  expect(await page.locator('.route-transition').evaluate(el => el.getAnimations()[0]?.playState)).toBe('paused')
  const popupPromise = context.waitForEvent('page')
  await page.locator('.header-whatsapp').click()
  const popup = await popupPromise
  await popup.waitForLoadState('domcontentloaded')
  const url = new URL(popup.url())
  expect(url.origin + url.pathname).toBe('https://wa.me/5584981363772')
  expect(url.searchParams.get('text')).toBe('Olá, Iara! Conheci seu site e gostaria de informações sobre o atendimento.')
  expect(await popup.evaluate(() => window.opener === null)).toBe(true)
  await expect(page).toHaveURL('/bpc')
  await expect(page.locator('.route-transition')).toHaveCSS('transform', 'none')
  expect(await page.locator('.route-transition').evaluate(el => el.getAnimations().length)).toBe(0)
  await popup.close()
})
