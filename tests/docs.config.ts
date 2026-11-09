import { defineConfig } from "@playwright/test"

// Each session can run its own docs server with DOCS_PORT.
const port = process.env.DOCS_PORT ?? "5400"

// CI settings match tests/playwright.config.ts, with an HTML report since this suite
// isn't sharded.
const isCI = !!process.env.CI

// CI tests a production build. `next dev` compiles each page on its first visit
// and restarts when it nears its memory limit, which dropped pages mid-test, and
// their HMR socket with them.
const docsServer = isCI
  ? "pnpm --filter docs build && pnpm --filter docs start"
  : "pnpm --filter docs dev"

// Smoke tests for the live examples on the docs site, in every framework.
export default defineConfig({
  testDir: "docs",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [["html", { open: "never" }], ["github"], ["dot"]]
    : [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    browserName: "chromium",
    trace: isCI ? "on-first-retry" : "off",
  },
  webServer: {
    command: `pnpm --filter examples build && ${docsServer}`,
    url: `http://localhost:${port}/docs/react`,
    reuseExistingServer: !isCI,
    // The examples build and the docs' first compile can take minutes on a cold cache.
    timeout: isCI ? 600_000 : 300_000,
  },
})
