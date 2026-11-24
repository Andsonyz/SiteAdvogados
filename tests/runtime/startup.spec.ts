import { test, expect } from '@playwright/test'

test('cold Vite startup transforms the application and survives route reloads', async ({ page }) => {
  const errors: string[] = [], failed: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.url().startsWith('http://127.0.0.1:5191') && response.status() >= 400) failed.push(response.url()) })
  for (const path of ['/', '/aposentadorias', '/bpc']) {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await page.reload()
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('a[href*="wa.me"]').first()).toBeAttached()
    for (const img of await page.locator('main img').all()) await img.evaluate(async (el: HTMLImageElement) => { el.loading = 'eager'; await el.decode() })
  }
  expect(errors).toEqual([])
  expect(failed).toEqual([])
})
