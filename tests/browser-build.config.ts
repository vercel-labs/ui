import { defineConfig } from "@playwright/test"

// The pages and the built files run on two servers, so every load crosses
// origins, like a site that loads ui-sdk from the docs site.
const pagesPort = process.env.BROWSER_BUILD_PORT ?? "5500"
const filesPort = String(Number(pagesPort) + 1)
const isCI = !!process.env.CI

// The web components built for pages without a bundler (`packages/web/browser`).
export default defineConfig({
  testDir: "browser-build",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["dot"]] : [["list"]],
  use: {
    baseURL: `http://localhost:${pagesPort}`,
    browserName: "chromium",
    trace: isCI ? "on-first-retry" : "off",
  },
  webServer: [
    {
      command: `pnpm --filter @ui-sdk/web build && node browser-build/serve.mjs ../packages/web/browser ${filesPort}`,
      url: `http://localhost:${filesPort}/web.js`,
      reuseExistingServer: !isCI,
      timeout: 300_000,
    },
    {
      command: `node browser-build/serve.mjs browser-build/pages ${pagesPort} files=http://localhost:${filesPort}`,
      url: `http://localhost:${pagesPort}/tabs.html`,
      reuseExistingServer: !isCI,
    },
  ],
})
