import { defineConfig } from "@playwright/test"

const port = process.env.NUXT_DEV_PORT ?? "5600"
const isCI = !!process.env.CI

// The Nuxt module in `nuxt dev`, with the packages installed from packed copies.
export default defineConfig({
  testDir: "nuxt-dev",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["dot"]] : [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    trace: isCI ? "on-first-retry" : "off",
  },
  webServer: {
    command: `node nuxt-dev/prepare.mjs && cd nuxt-dev/app && npx nuxt dev --port ${port} --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
})
