import { startDevServer } from "@ui-sdk/core/dev-server"

type Rewrite = { source: string; destination: string }
type Rewrites = Rewrite[] | { beforeFiles?: Rewrite[]; afterFiles?: Rewrite[]; fallback?: Rewrite[] }
type Config = { rewrites?: () => Rewrites | Promise<Rewrites> }

/**
 * Lets a coding agent read and operate the ui-sdk components on the page
 * while you develop: under `next dev`, adds an MCP server at `/__ui-sdk/mcp`.
 * `next build` gets your config unchanged. Connect the page with
 * `import("@ui-sdk/core/dev")` in development.
 *
 * @example
 * export default withUiSdk(nextConfig)
 * @experimental
 */
function withUiSdk<C extends Config>(config: C | ((phase: string, context: never) => C | Promise<C>)) {
  return async (phase: string, context: never) => {
    const resolved = typeof config === "function" ? await config(phase, context) : config
    if (phase !== "phase-development-server") return resolved
    const port = await startDevServer()
    const relay = { source: "/__ui-sdk/:path*", destination: `http://127.0.0.1:${port}/__ui-sdk/:path*` }
    return {
      ...resolved,
      async rewrites() {
        const own = (await resolved.rewrites?.()) ?? []
        if (Array.isArray(own)) return { beforeFiles: [relay], afterFiles: own }
        return { ...own, beforeFiles: [relay, ...(own.beforeFiles ?? [])] }
      },
    }
  }
}

export { withUiSdk }
