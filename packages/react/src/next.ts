import { startDevServer } from "@ui-sdk/core/dev-server"

/**
 * Lets a coding agent read and operate the ui-sdk components on the page
 * while you develop: under `next dev`, starts an MCP server at
 * `http://localhost:3399/__ui-sdk/mcp`, on this machine only, and tells the
 * page where it is. `port` changes 3399. `next build` gets your config
 * unchanged. Connect the page with `import("@ui-sdk/core/dev")` in development.
 *
 * @example
 * export default withUiSdk(nextConfig)
 * @experimental
 */
function withUiSdk<C extends object>(
  config: C | ((phase: string, context: { defaultConfig: C }) => C | Promise<C>),
  options: { port?: number } = {},
) {
  return async (phase: string, context: { defaultConfig: C }) => {
    const resolved = typeof config === "function" ? await config(phase, context) : config
    if (phase !== "phase-development-server") return resolved
    const port = await startDevServer(options.port)
    const { env } = resolved as { env?: Record<string, string | undefined> }
    return { ...resolved, env: { ...env, UI_SDK_DEV_SERVER: `http://localhost:${port}` } }
  }
}

export { withUiSdk }
