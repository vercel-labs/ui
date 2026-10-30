import { defineConfig } from "@playwright/test"
import { countGates, kitchenSinks, leakSpecs, specsThatSkip } from "./fixture-files"

// Each session can run its own playground with PLAYGROUND_PORT, so parallel work never shares a server.
const port = process.env.PLAYGROUND_PORT ?? "5300"

// *-ssr fixtures render to a string, then hydrate it. Vue, Svelte and Solid render theirs in Node.
const frameworks = [
  "react",
  "vue",
  "web",
  "react-data",
  "vue-data",
  "web-data",
  "react-ssr",
  "vue-ssr",
  "svelte",
  "svelte-data",
  "svelte-ssr",
  "solid",
  "solid-data",
  "solid-ssr",
]

// CI runs on 2-core Linux runners, so it uses one worker per core and retries timing
// flakes under load, reporting them as flaky. Each shard writes a blob report that a
// later job merges into one HTML report.
const isCI = !!process.env.CI

// CI and `pnpm test:pr` serve a build of the playground; PLAYGROUND_BUILD=1 does
// the same for a run of your own. See the web server below.
const built = isCI || process.env.PLAYGROUND_BUILD === "1"

// The popups that can present as a sheet run their shared specs once more as
// one, through ?presentation=sheet. Specs that measure placement against the
// trigger skip themselves there (see `isSheet` in fixtures.ts).
const sheetSpecs = ["menu", "popover", "dialog", "select", "combobox", "autocomplete"].map(
  (component) => `**/${component}.spec.ts`,
)

// Only popups move into a portal container, so the portal project runs the
// specs of components that open one. Every other spec would repeat its react
// run unchanged.
const portalSpecs = [
  "alignment",
  "autocomplete",
  "combobox",
  "command",
  "date-picker",
  "dialog",
  "drawer",
  "hover-card",
  "list",
  "menu",
  "menubar",
  "navigation-menu",
  "popover",
  "popup",
  "presentation",
  "select",
  "toast",
  "token-input",
  "tooltip",
  "trigger-menu",
].map((component) => `**/${component}.*spec.ts`)

// Chromium runs every project. The other engines run web only, since behavior
// lives in the core and differs by engine, not framework: every WebKit failure
// so far failed the same way on react, vue and web, except web's
// form-associated elements. Edge is Chromium's engine, so it has no project.
// Set BROWSERS=chromium to skip the others.
const browsers = [
  { name: "webkit", use: { browserName: "webkit" as const } },
  { name: "firefox", use: { browserName: "firefox" as const } },
].filter(({ name }) => !process.env.BROWSERS || process.env.BROWSERS.split(",").includes(name))

export default defineConfig<{ playground: boolean }>({
  testDir: "specs",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["blob"], ["github"], ["dot"]] : [["list"]],
  use: { baseURL: `http://localhost:${port}`, trace: isCI ? "on-first-retry" : "off", playground: true },
  projects: [
    // Specs that would only skip stay out of a project, since shards split by test count.
    ...frameworks.map((framework) => ({
      name: framework,
      use: { browserName: "chromium" as const, framework },
      testIgnore: specsThatSkip(framework),
    })),
    // The popup specs with every root popup portaled into a container. Core
    // moves the popup and adapters only pass `container` through, so React
    // alone runs them. Kitchen sinks load their page without the container, so
    // they'd only run again. Count gates measure work, which a portal doesn't change.
    ...["react"].map((framework) => ({
      name: `${framework}-portal`,
      use: { browserName: "chromium" as const, framework, fixtureOptions: { container: "portal-root" } },
      testMatch: portalSpecs,
      testIgnore: [kitchenSinks, countGates, ...specsThatSkip(framework)],
    })),
    ...["react", "vue", "web", "svelte", "solid"].map((framework) => ({
      name: `${framework}-sheet`,
      use: { browserName: "chromium" as const, framework, fixtureOptions: { presentation: "sheet" } },
      testMatch: sheetSpecs,
      testIgnore: specsThatSkip(framework),
    })),
    ...browsers.map((browser) => ({
      name: `web-${browser.name}`,
      use: { ...browser.use, framework: "web" },
      // Leak specs read the heap through CDP, which only Chromium has.
      testIgnore: [...specsThatSkip("web"), leakSpecs],
    })),
  ],
  // A shard that runs long stops itself before the job's timeout, so its report
  // still lists what passed, what failed and what never ran.
  globalTimeout: isCI ? 25 * 60_000 : 0,
  webServer: {
    // A development build: bundled, so a page loads about 20 files instead of
    // the dev server's hundreds of modules, with React's and the SDK's
    // development checks still on. A test runs 1.5 to 4.5 times faster on it
    // (Svelte the most), so only hand-run specs default to the dev server.
    command: built
      ? "pnpm --filter playground build && pnpm --filter playground preview"
      : "pnpm --filter playground dev",
    url: `http://localhost:${port}`,
    // `pnpm test:pr` serves the playground itself, in CI too.
    reuseExistingServer: !isCI || process.env.PLAYGROUND_SERVED === "1",
  },
})
