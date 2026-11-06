import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('WhatsApp uses the confirmed number and encoded message throughout the site', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('a[href*="wa.me"]')
  expect(await links.count()).toBeGreaterThan(2)
  for (const link of await links.all()) {
    const url = new URL((await link.getAttribute('href'))!)
    expect(url.origin + url.pathname).toBe('https://wa.me/5584981363772')
    expect(url.searchParams.get('text')).toBe('Olá, Iara! Conheci seu site e gostaria de informações sobre o atendimento.')
  }
  await expect(page.locator('body')).not.toContainText(/OAB/)
})

test('FAQ can be expanded and collapsed by keyboard', async ({ page }) => {
  await page.goto('/#duvidas')
  const question = page.getByRole('button', { name: 'O BPC é uma aposentadoria?' })
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(question).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByText('Não. O Benefício de Prestação Continuada', { exact: false })).toBeVisible()
  await page.keyboard.press('Space')
  await expect(question).toHaveAttribute('aria-expanded', 'false')
})

test('mobile navigation closes on Escape and on anchor navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const floating = page.locator('.floating-contact')
  const header = page.locator('.site-header')
  const actionBox = (await floating.boundingBox())!
  const headerBox = (await header.boundingBox())!
  expect(actionBox.y + actionBox.height).toBeLessThanOrEqual(headerBox.y + headerBox.height)
  const brandBox = (await page.locator('.site-header .brand').boundingBox())!
  expect(brandBox.x + brandBox.width).toBeLessThan(actionBox.x)
  const toggle = page.getByRole('button', { name: /Abrir menu|Fechar menu/ })
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page.getByRole('navigation', { name: 'Menu principal' }).getByRole('link', { name: 'Sobre', exact: true }).click()
  await expect(page).toHaveURL(/#sobre$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('#sobre')).toBeInViewport()
})

test('service pages support direct load, reload, return, and unknown routes', async ({ page }) => {
  for (const [path, title] of [['/aposentadorias', 'Aposentadorias'], ['/bpc', 'Benefício de Prestação Continuada']]) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title)
    await page.getByRole('link', { name: 'Voltar ao início', exact: true }).first().click()
    await expect(page).toHaveURL('/')
  }
  await page.getByRole('link', { name: 'Conhecer aposentadorias' }).click()
  await expect(page).toHaveURL('/aposentadorias')
  await page.getByRole('navigation', { name: 'Menu principal' }).getByRole('link', { name: 'Dúvidas' }).click()
  await expect(page).toHaveURL('/#duvidas')
  await page.goto('/nao-existe')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vamos encontrar o caminho de volta.')
})

test('short landscape menu keeps contact reachable and tablet action avoids content', async ({ page }) => {
  await page.setViewportSize({ width: 568, height: 320 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  const contact = page.getByRole('navigation', { name: 'Menu principal' }).getByRole('link', { name: 'Entre em contato' })
  await contact.focus()
  const contactBox = (await contact.boundingBox())!
  expect(contactBox.y + contactBox.height).toBeLessThanOrEqual(320)
  await page.setViewportSize({ width: 768, height: 900 })
  const actionBox = (await page.locator('.floating-contact').boundingBox())!
  const headerBox = (await page.locator('.site-header').boundingBox())!
  expect(actionBox.y + actionBox.height).toBeLessThanOrEqual(headerBox.y + headerBox.height)
})

for (const width of [375, 768, 1440]) {
  test(`layout and accessibility at ${width}px with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const path of ['/', '/aposentadorias', '/bpc', '/nao-existe']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      if (path === '/') {
        const portrait = page.getByRole('img', { name: 'Iara Santos, advogada com atuação em Direito Previdenciário' })
        await expect(portrait).toBeVisible()
        await expect.poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 1050)).toBe(true)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations).toEqual([])
    }
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `test-results/hero-${width}.png` })
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true })
    if (width === 1440) {
      await page.locator('.about-heading').screenshot({ path: 'test-results/about-brand.png' })
      await page.locator('.footer-top').screenshot({ path: 'test-results/footer-brand.png' })
    }
  })
}
