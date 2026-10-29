import { createColorScheme, createCookieStorage, createLocalStorage, createPreference } from "@ui-sdk/core"
import { frameworkIds } from "./frameworks"

// The site's color scheme, shown on <html> as `data-color-scheme`, which the
// stylesheet's colors follow. It's kept under "theme", the key the site used
// before, so readers keep what they chose.
const colorScheme = createColorScheme({ storage: createLocalStorage("theme"), global: true })

// The framework the reader last read, or "" before they've read one, shown on
// <html> as `data-framework`, so the header's picker names it from the first
// paint. It's kept in the "framework" cookie, which `next.config.mjs`
// redirects by. The pages are static, so the server never sees the cookie:
// the value catches up after hydration, like localStorage's.
const framework = createPreference({
  values: ["", ...frameworkIds],
  defaultValue: "",
  attribute: "data-framework",
  global: true,
  storage: { ...createCookieStorage("framework"), readsOnServer: false },
})

// The package manager that install commands show, shared by every set of
// package-manager tabs. It's kept under "tabs:package-manager", the key the
// site used before.
const packageManager = createPreference({
  values: ["npm", "pnpm", "yarn", "bun"],
  defaultValue: "npm",
  attribute: "data-package-manager",
  global: true,
  storage: createLocalStorage("tabs:package-manager"),
})

export { colorScheme, framework, packageManager }
