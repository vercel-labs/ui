import type { IncomingMessage, ServerResponse } from "node:http"
import { createDevServer } from "@ui-sdk/core/dev-server"
import { addDevServerHandler, addPluginTemplate, defineNuxtModule } from "nuxt/kit"

type Event = { node: { req: IncomingMessage; res: ServerResponse } }

/**
 * Lets a coding agent read and operate the ui-sdk components on the page
 * while you develop: under `nuxt dev`, adds an MCP server at `/__ui-sdk/mcp`
 * and connects the open page to it. Builds are unchanged.
 *
 * @example
 * export default defineNuxtConfig({ modules: ["@ui-sdk/vue/nuxt"] })
 * @experimental
 */
const nuxtModule = defineNuxtModule({
  meta: { name: "@ui-sdk/vue", compatibility: { nuxt: ">=3.13" } },
  setup(_, nuxt) {
    if (!nuxt.options.dev) return
    const { handle } = createDevServer()
    addDevServerHandler({
      handler: Object.assign(
        ({ node: { req, res } }: Event) =>
          new Promise<void>((resolve) => {
            res.once("close", () => resolve())
            handle(req, res, () => resolve())
          }),
        { __is_handler__: true },
      ) as never,
    })
    addPluginTemplate({
      filename: "ui-sdk-dev.client.mjs",
      mode: "client",
      getContents: () => 'import "@ui-sdk/core/dev"\nexport default () => {}\n',
    })
  },
})

export default nuxtModule
