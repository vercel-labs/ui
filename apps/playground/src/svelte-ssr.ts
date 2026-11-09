import { hydrate, type Component } from "svelte"

type Recorded = Window & {
  __hydrationErrors: string[]
  __serverHtml: string
  __serverForm: string
  __visibleBeforeHydration: boolean
  hydrate?: () => void
}

/**
 * Server renders, then the client hydrates. The server markup comes from the
 * playground's `/__ssr` route (ssr-plugin.ts), since Svelte's server output
 * is a separate compile. Every mismatch Svelte reports is recorded. With
 * ?hydrate=manual, the page stays server markup until `window.hydrate()`
 * runs, so specs can use the markup before hydration.
 */
async function hydrateFixture<Props extends Record<string, unknown>>(
  root: HTMLElement,
  fixture: string,
  component: Component<Props>,
  props: Props
) {
  const errors: string[] = []
  const recorded = window as unknown as Recorded
  recorded.__hydrationErrors = errors
  const search = new URLSearchParams({
    fixture,
    framework: "svelte",
    url: location.href,
  })
  const response = await fetch(`/__ssr?${search}`)
  if (!response.ok) {
    throw new Error(await response.text())
  }
  root.innerHTML = await response.text()
  // What the page shows before hydration, and whether open content shows
  // before any script runs on it, as server HTML would.
  recorded.__serverHtml = root.innerHTML
  recorded.__visibleBeforeHydration = !!root
    .querySelector<HTMLElement>('[data-slot$="-content"]')
    ?.checkVisibility()
  const form = root.querySelector("form")
  recorded.__serverForm = form
    ? new URLSearchParams(
        new FormData(form) as unknown as Record<string, string>
      ).toString()
    : ""
  const run = () => {
    const warn = console.warn
    const error = console.error
    console.warn = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      warn(...args)
    }
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      error(...args)
    }
    hydrate(component, { target: root, props })
  }
  if (new URLSearchParams(location.search).get("hydrate") === "manual") {
    recorded.hydrate = run
  } else {
    run()
  }
}

export { hydrateFixture }
