// @vitest-environment node
import { expect, test } from "vitest"
import { withUiSdk } from "../src/next"

test("leaves the config unchanged outside next dev", async () => {
  const config = { reactStrictMode: true }
  expect(await withUiSdk(config)("phase-production-build", undefined as never)).toBe(config)
})

test("starts the server on its own port and tells the page where it is", async () => {
  const config = await withUiSdk({ env: { OWN: "1" } }, { port: 0 })(
    "phase-development-server",
    undefined as never,
  )
  expect(config).not.toHaveProperty("rewrites")
  expect(config.env).toEqual({
    OWN: "1",
    UI_SDK_DEV_SERVER: expect.stringMatching(/^http:\/\/localhost:\d+$/),
  })
  const response = await fetch(`${config.env.UI_SDK_DEV_SERVER}/__ui-sdk/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }),
  })
  expect(response.status).toBe(200)
})
