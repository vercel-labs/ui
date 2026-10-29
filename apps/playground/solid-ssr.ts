import type { Plugin } from "vite"

// Answers `/__ssr?fixture=<name>&framework=solid&…` with the fixture's server
// HTML, for the `solid-ssr` fixtures: Solid's server output is a separate
// compile, so a fixture can't render itself to a string in the browser. The
// dev server renders through its own SSR module
// graph. `vite preview` has no module runner, so it starts a dev server in
// middleware mode just to answer this path.
function solidSsr(): Plugin {
  const path = "/__ssr"
  type Renderer = { renderFixture: (fixture: string, search: string) => Promise<string> }
  const handle =
    (load: () => Promise<Renderer>) =>
    async (
      req: { url?: string },
      res: { statusCode: number; setHeader: (n: string, v: string) => void; end: (s: string) => void },
      next: () => void,
    ) => {
      const url = new URL(req.url ?? "/", "http://localhost")
      // The Svelte renderer answers the same path for its own framework.
      if (url.pathname !== path || !url.searchParams.get("framework")?.startsWith("solid")) return next()
      try {
        const { renderFixture } = await load()
        const html = await renderFixture(url.searchParams.get("fixture") ?? "", url.search)
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
      server.middlewares.use(handle(() => server.ssrLoadModule("/src/ssr/solid.ts") as Promise<Renderer>))
    },
    async configurePreviewServer(preview) {
      const { createServer } = await import("vite")
      const server = await createServer({
        configFile: preview.config.configFile,
        server: { middlewareMode: true, hmr: false, watch: null },
        appType: "custom",
        logLevel: "warn",
      })
      preview.middlewares.use(handle(() => server.ssrLoadModule("/src/ssr/solid.ts") as Promise<Renderer>))
    },
  }
}

export { solidSsr }
