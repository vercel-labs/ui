import { createDevServer } from "./dev-server.ts"

const connect = "virtual:ui-sdk-dev"

/**
 * Lets a coding agent read and operate the ui-sdk components on the page
 * while you develop: adds an MCP server at `/__ui-sdk/mcp` to Vite's dev
 * server, and connects the open page to it. Builds are unchanged.
 *
 * @example
 * export default defineConfig({ plugins: [uiSdk()] })
 * @experimental
 */
function uiSdk() {
  return {
    name: "ui-sdk",
    apply: "serve" as const,
    configureServer(server: {
      middlewares: { use: (handle: ReturnType<typeof createDevServer>["handle"]) => void }
    }) {
      server.middlewares.use(createDevServer().handle)
    },
    resolveId(id: string) {
      if (id === connect) return `\0${connect}`
    },
    load(id: string) {
      if (id === `\0${connect}`) return 'import "@ui-sdk/core/dev"'
    },
    // Every Vite framework loads Vite's client on every page, even those that
    // render their own HTML, like SvelteKit and Astro.
    transform(code: string, id: string, options?: { ssr?: boolean }) {
      if (options?.ssr || !id.endsWith("/vite/dist/client/client.mjs")) return
      return `${code}\nimport("${connect}")\n`
    },
  }
}

export { uiSdk }
