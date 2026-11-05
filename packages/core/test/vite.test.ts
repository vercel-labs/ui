// @vitest-environment node
import { expect, test } from "vitest"
import { uiSdk } from "../src/page/agent/vite"

const client = "/app/node_modules/vite/dist/client/client.mjs"

test("connects every page through Vite's client", () => {
  const plugin = uiSdk()
  const code = plugin.transform("export {}", client)
  const id = /import\("(.+)"\)/.exec(code ?? "")?.[1]
  const resolved = plugin.resolveId(id ?? "")
  expect(resolved).toBeDefined()
  expect(plugin.load(resolved ?? "")).toBe('import "@ui-sdk/core/dev"')
})

test("leaves other modules and server rendering alone", () => {
  const plugin = uiSdk()
  expect(plugin.transform("export {}", "/app/src/main.ts")).toBeUndefined()
  expect(plugin.transform("export {}", client, { ssr: true })).toBeUndefined()
})
