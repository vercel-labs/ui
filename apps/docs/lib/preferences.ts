import {
  createColorScheme,
  createCookieStorage,
  createLocalStorage,
  createPreference,
} from "@ui-sdk/core"
import { usePreference } from "@ui-sdk/react/preferences"
import * as React from "react"
import { type Framework, frameworkIds } from "./frameworks"

// "theme" is the key the site used before, so readers keep their choice.
const colorScheme = createColorScheme({
  storage: createLocalStorage("theme"),
  global: true,
})

// "" until the reader picks one. The pages are static, so the server never
// reads the cookie: `next.config.mjs` reads it instead, and serves the page
// built for that framework.
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

// The framework the page was built for, from `PageFramework`.
const RenderedFramework = React.createContext<Framework | undefined>(undefined)

const currentFramework = () => framework.get().value

/**
 * The shared framework preference, else React, persisted for links and server
 * redirects. It hydrates as the framework the page was built for, so the
 * server's HTML already shows the reader's.
 */
function useFramework() {
  const rendered = React.useContext(RenderedFramework)
  const current = React.useSyncExternalStore(
    framework.subscribe,
    currentFramework,
    () => rendered ?? framework.initialState.value
  )
  return [current || "react", setFramework] as const
}

export {
  colorScheme,
  framework,
  packageManager,
  RenderedFramework,
  setFramework,
  styling,
  useFramework,
  useSavedFramework,
}
