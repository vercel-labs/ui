import { createDevServer } from "./dev-server"

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
    transformIndexHtml: {
      order: "pre" as const,
      handler: () => [
        {
          tag: "script",
          attrs: { type: "module" },
          children: 'import "@ui-sdk/core/dev"',
          injectTo: "head" as const,
        },
      ],
    },
  }
}

export { uiSdk }
