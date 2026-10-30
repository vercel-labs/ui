import type { IncomingMessage, ServerResponse } from "node:http"
import path from "node:path"
import type { Plugin } from "vite"

// Answers /__ssr?fixture=<name>&framework=<svelte|vue>&url=<page url> with
// the fixture rendered on the server, for the *-ssr fixtures. Svelte's server
// output is a separate compile, and Vue's renders in Node so its markup uses
// Node's ICU, as a real server's does. In development it loads the renderer
// through Vite. The preview server, which CI uses, loads the build
// `vite build --ssr` wrote to dist-ssr.
type Renderer = { renderFixture: (fixture: string, url: string) => Promise<string> }

const renderers: Record<string, string> = { svelte: "/src/ssr.ts", vue: "/src/ssr/vue.ts" }

function ssrFixtures() {
  const handle =
    (load: (entry: string) => Promise<Renderer>) =>
    async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
      const { originalUrl } = req as IncomingMessage & { originalUrl?: string }
      const url = new URL(originalUrl ?? req.url ?? "", "http://localhost")
      if (url.pathname !== "/__ssr") return next()
      const fixture = url.searchParams.get("fixture")
      const framework = url.searchParams.get("framework") ?? ""
      const page = url.searchParams.get("url")
      const entry = renderers[framework]
      if (!fixture || !page || !entry) {
        res.statusCode = 404
        res.end(`No server renderer for ${framework || "that framework"}.`)
        return
      }
      try {
        const html = await (await load(entry)).renderFixture(fixture, page)
        res.setHeader("content-type", "text/html")
        res.end(html)
      } catch (error) {
        res.statusCode = 500
        res.end(error instanceof Error ? (error.stack ?? error.message) : String(error))
      }
    }
  return {
    name: "ssr-fixtures",
    // Workspace packages ship TypeScript source with extensionless imports,
    // which Node can't load on its own, so Vite transforms them.
    config: () => ({ ssr: { noExternal: [/^@ui-sdk\//, "tests"] } }),
    configResolved(config) {
      // vite-plugin-svelte externalizes the dependencies of a package that
      // peers on Svelte, and `external` wins over `noExternal`.
      const ours = (dep: string | RegExp) => typeof dep === "string" && dep.startsWith("@ui-sdk/")
      for (const resolve of [config.ssr, config.environments.ssr?.resolve]) {
        if (Array.isArray(resolve?.external)) resolve.external = resolve.external.filter((dep) => !ours(dep))
      }
    },
    configureServer(server) {
      server.middlewares.use(handle((entry) => server.ssrLoadModule(entry) as Promise<Renderer>))
    },
    configurePreviewServer(server) {
      // The entries build to dist-ssr/<name>.js.
      const built = (entry: string) =>
        path.resolve(server.config.root, "dist-ssr", `${path.basename(entry, path.extname(entry))}.js`)
      server.middlewares.use(handle((entry) => import(built(entry))))
    },
  } satisfies Plugin
}

export { ssrFixtures }
