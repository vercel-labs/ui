import type { Component } from "svelte"
import { render } from "svelte/server"

// Renders a Svelte fixture on the server, for the svelte-ssr fixtures. Each
// fixture folder holds one `<Name>Fixture.svelte`, compiled here for the
// server. See ssr-plugin.ts for the route that calls this.
const components = import.meta.glob<{ default: Component<any> }>(
  "./fixtures/*/*Fixture.svelte"
)

async function renderFixture(fixture: string, url: string) {
  const path = Object.keys(components).find((key) =>
    key.startsWith(`./fixtures/${fixture}/`)
  )
  if (!path) {
    throw new Error(`No Svelte fixture for ${fixture}.`)
  }
  const { default: component } = await components[path]()
  const location = new URL(url)
  // Fixtures read their options from the page's URL, as they do in the browser.
  Object.assign(globalThis, { location })
  try {
    // ?data renders the same fixture from `items`.
    return render(component, {
      props: { data: location.searchParams.has("data") },
    }).body
  } finally {
    delete (globalThis as { location?: unknown }).location
  }
}

export { renderFixture }
