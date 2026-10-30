import { createColorScheme, createCookieStorage, createLocalStorage, createPreference } from "@ui-sdk/core"
import { frameworkIds } from "./frameworks"

// "theme" is the key the site used before, so readers keep their choice.
const colorScheme = createColorScheme({ storage: createLocalStorage("theme"), global: true })

// "" until the reader picks one. `next.config.mjs` redirects by the cookie,
// and the pages are static, so the server never reads it.
const framework = createPreference({
  values: ["", ...frameworkIds],
  defaultValue: "",
  attribute: "data-framework",
  global: true,
  storage: { ...createCookieStorage("framework"), readsOnServer: false },
})

const packageManager = createPreference({
  values: ["npm", "pnpm", "yarn", "bun"],
  defaultValue: "npm",
  attribute: "data-package-manager",
  global: true,
  storage: createLocalStorage("tabs:package-manager"),
})

export { colorScheme, framework, packageManager }
