import { renderToString } from "@vue/server-renderer"
import { createSSRApp, type Component } from "vue"
import { fixtureProps } from "./vue-hydrate"

// Renders a Vue fixture on the server, for `/__ssr`, so its markup comes from
// Node's runtime and ICU rather than the browser's. Fixtures read their
// options from `location`, so the page's URL stands in for it.
const fixtures = import.meta.glob("../fixtures/*/vue-ssr.ts") as Record<
  string,
  () => Promise<{ Fixture: Component }>
>

// @vitejs/plugin-vue compiles `<script lang="ts">` with the dev server's oxc
// options, where @vitejs/plugin-react turns Fast Refresh on, so Vue files
// call `$RefreshSig$`. The browser gets it from React's preamble, as a no-op
// until React registers, and the server needs the same no-op.
Object.assign(globalThis, { $RefreshSig$: () => (type: unknown) => type })

async function renderFixture(fixture: string, url: string) {
  const load = fixtures[`../fixtures/${fixture}/vue-ssr.ts`]
  if (!load) {
    throw new Error(`No Vue fixture for ${fixture}.`)
  }
  const { Fixture } = await load()
  const location = new URL(url)
  // Without an error handler, Vue's development build throws out of a
  // `setup` that fails and leaves that component as the current instance,
  // and every later render in the process loses its parts' content. Nuxt
  // always sets one, so the fixture reports the error once it's rendered.
  const app = createSSRApp(Fixture, fixtureProps(Fixture, location.search))
  let failure: unknown
  app.config.errorHandler = (error) => void (failure ??= error)
  // Requests overlap, and Vue runs every fixture's setup and render before
  // `renderToString` first awaits, since none has an async setup, so the
  // stand-in is in place for exactly one render at a time.
  const realm = globalThis as { location?: unknown }
  realm.location = location
  let rendering: Promise<string>
  try {
    rendering = renderToString(app)
  } finally {
    delete realm.location
  }
  const html = await rendering
  if (failure) {
    throw failure
  }
  return html
}

export { renderFixture }
