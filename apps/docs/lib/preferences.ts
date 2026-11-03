import { createColorScheme, createCookieStorage, createLocalStorage, createPreference } from "@ui-sdk/core"
import { usePreference } from "@ui-sdk/react/preferences"
import { type Framework, frameworkIds } from "./frameworks"

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

const styling = createPreference({
  values: ["css", "tailwind"],
  defaultValue: "css",
  attribute: "data-styling",
  global: true,
  storage: createLocalStorage("tabs:styling"),
})

function setFramework(next: Framework) {
  framework.set(next)
}

/** The saved framework choice, or undefined before the reader has made one. */
function useSavedFramework() {
  return usePreference(framework).value || undefined
}

/** The shared framework preference, else React, persisted for links and server redirects. */
function useFramework() {
  const current = useSavedFramework() ?? "react"
  return [current, setFramework] as const
}

export { colorScheme, framework, packageManager, setFramework, styling, useFramework, useSavedFramework }
