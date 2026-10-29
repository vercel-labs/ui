// What a `vue-ssr` fixture does: fetches its server HTML from `/__ssr`, which
// renders it in Node as a Nuxt server would, shows it, records what the specs
// read, then hydrates it. Every mismatch Vue reports is recorded.
import { createSSRApp, type Component } from "vue"
import { serializeForm } from "tests/fixtures/select.ts"

// ?data renders a list from `items`, for the fixtures that take that prop.
function fixtureProps(fixture: Component, search: string) {
  const declared = (fixture as { props?: Record<string, unknown> }).props ?? {}
  return "data" in declared ? { data: new URLSearchParams(search).has("data") } : {}
}

// Vue's warnings pass vnodes along with the message, and `String` throws on
// objects without a prototype.
function describe(args: unknown[]) {
  return args
    .map((arg) =>
      typeof arg === "string" || arg instanceof Error ? String(arg) : Object.prototype.toString.call(arg),
    )
    .join(" ")
}

async function hydrateFixture(root: HTMLElement, fixture: Component) {
  const errors: string[] = []
  const page = window as unknown as Record<string, unknown>
  page.__hydrationErrors = errors
  const name = new URLSearchParams(location.search).get("fixture") ?? ""
  const request = new URLSearchParams({ fixture: name, framework: "vue", url: location.href })
  const response = await fetch(`/__ssr?${request}`)
  root.innerHTML = await response.text()
  if (!response.ok) throw new Error(`Server rendering ${name} failed:\n${root.textContent}`)
  // What the page shows before hydration, and whether open content shows
  // before any script runs on it, as server HTML would.
  page.__serverHtml = root.innerHTML
  page.__visibleBeforeHydration = !!root
    .querySelector<HTMLElement>('[data-slot$="-content"]')
    ?.checkVisibility()
  const form = root.querySelector("form")
  page.__serverForm = form ? serializeForm(form) : ""
  const run = () => {
    const warn = console.warn
    const error = console.error
    console.warn = (...args: unknown[]) => {
      errors.push(describe(args))
      warn(...args)
    }
    console.error = (...args: unknown[]) => {
      errors.push(describe(args))
      error(...args)
    }
    createSSRApp(fixture, fixtureProps(fixture, location.search)).mount(root)
  }
  // With ?hydrate=manual, the page stays server markup until window.hydrate() runs.
  if (new URLSearchParams(location.search).get("hydrate") === "manual") page.hydrate = run
  else run()
}

export { fixtureProps, hydrateFixture }
