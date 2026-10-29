// @vitest-environment jsdom
// A preference, and the script `Preferences` renders for a list of them, run
// the way the browser's parser would: with the script as currentScript.
import { afterEach, expect, test } from "vitest"
import { createColorScheme } from "../src/foundation/preferences/color-scheme"
import { createPreference, preferencesScript } from "../src/foundation/preferences/preference"
import {
  createCookieStorage,
  createLocalStorage,
  createSessionStorage,
} from "../src/foundation/storage/storage"

const tones = ["default", "light", "medium", "dark"] as const

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  localStorage.clear()
  sessionStorage.clear()
  document.cookie = "skin-tone=; path=/; max-age=0"
  delete (window as Window & { __uiSdkStorage?: unknown }).__uiSdkStorage
  document.body.replaceChildren()
  for (const name of document.documentElement.getAttributeNames())
    if (name.startsWith("data-")) document.documentElement.removeAttribute(name)
})

// Server HTML for a `Preferences` element: the script is its first child.
function load(script: string, attributes = "") {
  document.body.innerHTML = `<div data-slot="preferences" ${attributes}><script>${script}</script><p>App</p></div>`
  const element = document.body.querySelector("script")!
  Object.defineProperty(document, "currentScript", { configurable: true, value: element })
  new Function(element.textContent!)()
  Object.defineProperty(document, "currentScript", { configurable: true, value: null })
  return document.body.querySelector<HTMLElement>('[data-slot="preferences"]')!
}

test("needs a data attribute and a default among its values", () => {
  expect(() =>
    createPreference({ values: tones, defaultValue: "default", attribute: "class" as `data-${string}` }),
  ).toThrow(/data-\*/)
  expect(() =>
    createPreference({ values: tones, defaultValue: "sepia" as "default", attribute: "data-skin-tone" }),
  ).toThrow(/isn't one/)
})

test("keeps a value, saves it, and refuses values outside its list", () => {
  const changes: [string, string][] = []
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createLocalStorage("skin-tone"),
    onValueChange: (value, details) => changes.push([value, details.reason]),
  })
  expect(skinTone.get()).toEqual({ value: "default" })
  expect(skinTone.get()).toBe(skinTone.get())
  expect(skinTone.set("dark", { reason: "item-press" })).toBe(true)
  expect(localStorage.getItem("skin-tone")).toBe("dark")
  expect(skinTone.set("purple" as "dark")).toBe(false)
  expect(changes).toEqual([["dark", "item-press"]])
})

test("reads a saved value back once something subscribes, and goes back to the default once it's removed", () => {
  localStorage.setItem("skin-tone", "medium")
  const reasons: string[] = []
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createLocalStorage("skin-tone"),
    onValueChange: (_value, details) => reasons.push(details.reason),
  })
  expect(skinTone.initialState.value).toBe("default")
  expect(skinTone.get().value).toBe("medium")
  const stop = skinTone.subscribe(() => {})
  expect(skinTone.get().value).toBe("medium")
  createLocalStorage("skin-tone").remove()
  expect(skinTone.get().value).toBe("default")
  stop()
  expect(reasons).toEqual(["restore", "storage-sync"])
})

test("a cookie starts the value right away, as the server's does", () => {
  document.cookie = "skin-tone=dark; path=/"
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createCookieStorage("skin-tone"),
  })
  expect(skinTone.initialState.value).toBe("dark")
})

test("the script puts global preferences on <html> and the rest on its own element", () => {
  localStorage.setItem("color-scheme", "dark")
  sessionStorage.setItem("skin-tone", "medium")
  const colorScheme = createColorScheme({ storage: createLocalStorage("color-scheme"), global: true })
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createSessionStorage("skin-tone"),
  })
  const element = load(preferencesScript([colorScheme, skinTone]), 'data-skin-tone="default"')
  expect(document.documentElement.dataset.colorScheme).toBe("dark")
  expect(element.dataset.colorScheme).toBeUndefined()
  expect(element.dataset.skinTone).toBe("medium")
})

test("the script shows the default for nothing saved, a value it doesn't allow, or no storage", () => {
  localStorage.setItem("skin-tone", '"><img src=x onerror=alert(1)>')
  const saved = createPreference({
    values: tones,
    defaultValue: "light",
    attribute: "data-skin-tone",
    storage: createLocalStorage("skin-tone"),
    global: true,
  })
  const density = createPreference({
    values: ["comfortable", "compact"],
    defaultValue: "comfortable",
    attribute: "data-density",
    global: true,
  })
  const script = preferencesScript([saved, density])
  expect(script).not.toContain("<img")
  load(script)
  expect(document.documentElement.dataset.skinTone).toBe("light")
  expect(document.documentElement.dataset.density).toBe("comfortable")
})

test("the script reads a cookie, for a global preference the server can't put on <html>", () => {
  document.cookie = "skin-tone=dark; path=/"
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createCookieStorage("skin-tone"),
    global: true,
  })
  load(preferencesScript([skinTone]))
  expect(document.documentElement.dataset.skinTone).toBe("dark")
})

test("follow keeps a primitive's key in step after a microtask", async () => {
  localStorage.setItem("skin-tone", "dark")
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: createLocalStorage("skin-tone"),
  })
  let state = { skinTone: skinTone.initialState }
  const store = { get: () => state, set: (partial: typeof state) => (state = { ...state, ...partial }) }
  cleanups.push(skinTone.follow(store, "skinTone"))
  expect(state.skinTone.value).toBe("default")
  await new Promise<void>((resolve) => queueMicrotask(resolve))
  expect(state.skinTone.value).toBe("dark")
})

test("a value set before anything subscribes shows, even when saving it failed", () => {
  localStorage.setItem("skin-tone", "medium")
  const storage = createLocalStorage("skin-tone")
  const skinTone = createPreference({
    values: tones,
    defaultValue: "default",
    attribute: "data-skin-tone",
    storage: { ...storage, set: () => false },
  })
  expect(skinTone.get().value).toBe("medium")
  skinTone.set("dark")
  expect(skinTone.get().value).toBe("dark")
})
