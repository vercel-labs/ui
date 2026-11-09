// What a `solid-ssr` fixture does: fetches its server HTML from `/__ssr`,
// shows it, records what the specs read, then hydrates it. Every error Solid
// reports while hydrating is recorded.
import { hydrate } from "@solidjs/web"
import type { JSX } from "@solidjs/web"

async function hydrateFixture(
  root: HTMLElement,
  fixture: string,
  app: () => JSX.Element,
  { serverForm = false, manual = false } = {}
) {
  const errors: string[] = []
  const page = window as unknown as Record<string, unknown>
  page.__hydrationErrors = errors
  // The route answers for `solid`; the page's framework is `solid-ssr`.
  const search = new URLSearchParams(location.search)
  search.set("framework", "solid")
  const response = await fetch(`/__ssr?${search}`)
  root.innerHTML = await response.text()
  if (!response.ok) {
    throw new Error(`Server rendering ${fixture} failed:\n${root.textContent}`)
  }
  // What the page shows before hydration.
  page.__serverHtml = root.innerHTML
  page.__visibleBeforeHydration = !!root
    .querySelector<HTMLElement>('[data-slot$="-content"]')
    ?.checkVisibility()
  if (serverForm) {
    const { serializeForm } = await import("tests/fixtures/select.ts")
    const form = root.querySelector("form")
    page.__serverForm = form ? serializeForm(form) : ""
  }
  const run = () => {
    // What the hydration script a server page carries sets up: the registry
    // `hydrate()` reads. Events before hydration aren't replayed here.
    page._$HY ??= { events: [], completed: new WeakSet(), r: {}, fe() {} }
    const error = console.error
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      error(...args)
    }
    hydrate(app, root)
  }
  // With ?hydrate=manual, the page stays server markup until window.hydrate() runs.
  if (
    manual &&
    new URLSearchParams(location.search).get("hydrate") === "manual"
  ) {
    page.hydrate = run
  } else {
    run()
  }
}

export { hydrateFixture }
