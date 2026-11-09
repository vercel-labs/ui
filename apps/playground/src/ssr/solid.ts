import { renderToString } from "@solidjs/web"
import { createComponent } from "solid-js"

// Renders a Solid fixture on the server, for `/__ssr`. Fixtures read their
// options from `location.search`, so the request's search stands in for it.
const fixtures = import.meta.glob("../fixtures/*/solid.tsx") as Record<
  string,
  () => Promise<{ Fixture: (props: Record<string, unknown>) => unknown }>
>

async function renderFixture(fixture: string, search: string) {
  const load = fixtures[`../fixtures/${fixture}/solid.tsx`]
  if (!load) {
    throw new Error(`No Solid fixture for ${fixture}.`)
  }
  const params = new URLSearchParams(search)
  const realm = globalThis as { location?: unknown }
  // Loaded first: requests overlap, and the render below is synchronous, so
  // the stand-in is in place for exactly one render at a time.
  const { Fixture } = await load()
  realm.location = { search }
  try {
    // ?data renders a list from `items`, like the client fixtures do.
    return renderToString(() =>
      createComponent(Fixture as never, { data: params.has("data") })
    )
  } finally {
    delete realm.location
  }
}

export { renderFixture }
