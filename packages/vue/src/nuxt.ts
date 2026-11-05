import type { IncomingMessage, ServerResponse } from "node:http"
import { createDevServer } from "@ui-sdk/core/dev-server"
import { addComponent, addDevServerHandler, addImports, addPluginTemplate, defineNuxtModule } from "nuxt/kit"
import { names } from "./nuxt-names"

type Options = { prefix: string }
type Event = { node: { req: IncomingMessage; res: ServerResponse } }

/**
 * Registers every part as a component and every controller as an import, so
 * templates use them without imports. Under `nuxt dev`, it also adds an MCP
 * server at `/__ui-sdk/mcp` that lets a coding agent operate the page.
 *
 * @example
 * export default defineNuxtConfig({ modules: ["@ui-sdk/vue/nuxt"] })
 * @experimental
 */
const nuxtModule = defineNuxtModule<Options>({
  meta: { name: "@ui-sdk/vue", configKey: "uiSdk", compatibility: { nuxt: ">=3.13" } },
  defaults: { prefix: "" },
  setup({ prefix }, nuxt) {
    for (const [entry, [parts, functions]] of Object.entries(names)) {
      const from = `@ui-sdk/vue/${entry}`
      for (const name of parts)
        addComponent({ name: prefix + name, export: name, filePath: from, priority: -1 })
      addImports(functions.map((name) => ({ name, from })))
    }

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
