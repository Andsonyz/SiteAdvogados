import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/runtime',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5191', browserName: 'chromium', viewport: { width: 390, height: 844 } },
  webServer: {
    command: 'npm run dev -- --port 5191 --strictPort --force',
    url: 'http://127.0.0.1:5191', reuseExistingServer: false, timeout: 90000,
  },
})
