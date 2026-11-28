import "@angular/compiler"
import {
  DOCUMENT,
  provideZonelessChangeDetection,
  type Type,
} from "@angular/core"
import {
  createApplication,
  provideClientHydration,
  withNoHttpTransferCache,
  type BootstrapContext,
} from "@angular/platform-browser"
import {
  provideServerRendering,
  renderApplication,
} from "@angular/platform-server"
import { DATA } from "../angular-mount"

// Renders an Angular fixture on the server, for `/__ssr`. Fixtures read their
// options from `location`, so the page's URL stands in for it.
const fixtures = import.meta.glob("../fixtures/*/angular-ssr.ts") as Record<
  string,
  () => Promise<{ Fixture: Type<unknown> }>
>

async function renderFixture(fixture: string, url: string) {
  const load = fixtures[`../fixtures/${fixture}/angular-ssr.ts`]
  if (!load) {
    throw new Error(`No Angular fixture for ${fixture}.`)
  }
  const { Fixture } = await load()
  const location = new URL(url)
  const html = await renderApplication(
    async (context: BootstrapContext) => {
      const app = await createApplication(
        {
          providers: [
            provideZonelessChangeDetection(),
            provideServerRendering(),
            provideClientHydration(withNoHttpTransferCache()),
            { provide: DATA, useValue: location.searchParams.has("data") },
          ],
        },
        context
      )
      // Requests overlap, and a fixture reads its options as it's created, so
      // the stand-in is in place for exactly one render at a time.
      const realm = globalThis as { location?: unknown }
      realm.location = location
      try {
        app.bootstrap(
          Fixture,
          app.injector.get(DOCUMENT).querySelector("#root")
        )
      } finally {
        delete realm.location
      }
      return app
    },
    {
      document: '<div id="root"></div>',
      url,
      allowedHosts: [location.hostname],
    }
  )
  // The root with its hydration marker before it and its state after it.
  return html.slice(html.indexOf("<body>") + 6, html.lastIndexOf("</body>"))
}

export { renderFixture }
