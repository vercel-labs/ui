// @vitest-environment node
import { createServer, type Server } from "node:http"
import type { AddressInfo } from "node:net"
import { afterEach, expect, test } from "vitest"
import { createDevServer } from "../src/page/agent/dev-server"

let server: Server

const start = async () => {
  server = createServer(createDevServer().handle)
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/__ui-sdk`
  // A page's poll stays open until the server closes, after the test.
  const post = (path: string, body: object) => {
    const response = fetch(`${base}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    response.catch(() => {})
    return response
  }
  const rpc = async (method: string, params?: object) =>
    (await (await post("mcp", { jsonrpc: "2.0", id: 1, method, params })).json()).result
  return { post, rpc }
}

afterEach(() => {
  server.closeAllConnections()
  server.close()
})

test("lists the bridge's three tools", async () => {
  const { rpc } = await start()
  expect((await rpc("tools/list")).tools.map((tool: { name: string }) => tool.name)).toEqual([
    "snapshot",
    "act",
    "query",
  ])
})

test("answers a tool call with an error while no page is open", async () => {
  const { rpc } = await start()
  const result = await rpc("tools/call", { name: "snapshot", arguments: {} })
  expect(result.isError).toBe(true)
  expect(result.content[0].text).toMatch(/Open the app/)
})

test("runs a tool call in the page and returns its result", async () => {
  const { post, rpc } = await start()
  const poll = post("page", { page: "a" })
  await new Promise((resolve) => setTimeout(resolve, 20))
  const result = rpc("tools/call", { name: "query", arguments: { text: "Region" } })
  const call = await (await poll).json()
  expect(call).toMatchObject({ name: "query", input: { text: "Region" } })
  post("page", { page: "a", answer: { id: call.id, result: [{ ref: "c1" }] } })
  expect((await result).content[0].text).toBe('[{"ref":"c1"}]')
})

test("sends calls to the page that opened last", async () => {
  const { post, rpc } = await start()
  post("page", { page: "a" })
  await new Promise((resolve) => setTimeout(resolve, 20))
  const second = post("page", { page: "b" })
  await new Promise((resolve) => setTimeout(resolve, 20))
  const result = rpc("tools/call", { name: "snapshot", arguments: {} })
  expect((await second).status).toBe(200)
  result.catch(() => {})
})

test("turns away other sites, rebound domains and simple requests", async () => {
  await start()
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/__ui-sdk/mcp`
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" })
  const status = async (headers: Record<string, string>) =>
    (await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body }))
      .status
  expect(await status({})).toBe(200)
  expect(await status({ "Content-Type": "text/plain" })).toBe(403)
  expect(await status({ Origin: "https://example.com" })).toBe(403)
  expect(await status({ Origin: `http://127.0.0.1:${(server.address() as AddressInfo).port}` })).toBe(200)
  expect(await status({ "X-Forwarded-Host": "example.com" })).toBe(403)
})

test("takes a call's answer only from the page it went to", async () => {
  const { post, rpc } = await start()
  const poll = post("page", { page: "a" })
  await new Promise((resolve) => setTimeout(resolve, 20))
  const result = rpc("tools/call", { name: "snapshot", arguments: {} })
  const call = await (await poll).json()
  post("page", { page: "b", answer: { id: call.id, result: "forged" } })
  await new Promise((resolve) => setTimeout(resolve, 20))
  post("page", { page: "a", answer: { id: call.id, result: [] } })
  expect((await result).content[0].text).toBe("[]")
})

test("answers a body that isn't a JSON object without failing", async () => {
  const { post } = await start()
  expect((await post("mcp", null as never)).status).toBe(202)
  expect((await post("page", null as never)).status).toBe(400)
})
