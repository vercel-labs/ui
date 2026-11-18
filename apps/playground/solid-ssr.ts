import { resolve } from "node:path"
import type { Plugin } from "vite"

// Answers `/__ssr?fixture=<name>&framework=solid&…` with the fixture's server HTML. The
// dev server renders through Vite. The preview server, which CI uses, loads the build in
// dist-ssr, since Solid compiles a build differently and both sides have to match.
function solidSsr(): Plugin {
  const path = "/__ssr"
  type Renderer = {
    renderFixture: (fixture: string, search: string) => Promise<string>
  }
  const handle =
    (load: () => Promise<Renderer>) =>
    async (
      req: { url?: string },
      res: {
        statusCode: number
        setHeader: (n: string, v: string) => void
        end: (s: string) => void
      },
      next: () => void
    ) => {
      const url = new URL(req.url ?? "/", "http://localhost")
      // The Svelte renderer answers the same path for its own framework.
      if (
        url.pathname !== path ||
        !url.searchParams.get("framework")?.startsWith("solid")
      ) {
        return next()
      }
      try {
        const { renderFixture } = await load()
        const html = await renderFixture(
          url.searchParams.get("fixture") ?? "",
          url.search
        )
        res.setHeader("content-type", "text/html; charset=utf-8")
        res.end(html)
      } catch (error) {
        res.statusCode = 500
        res.end(String((error as Error).stack ?? error))
      }
    }
  return {
    name: "solid-ssr-fixtures",
    configureServer(server) {
      server.middlewares.use(
        handle(
          () => server.ssrLoadModule("/src/ssr/solid.ts") as Promise<Renderer>
        )
      )
    },
    configurePreviewServer(preview) {
      const built = resolve(preview.config.root, "dist-ssr", "solid.js")
      preview.middlewares.use(handle(() => import(built) as Promise<Renderer>))
    },
  }
}

export { solidSsr }
