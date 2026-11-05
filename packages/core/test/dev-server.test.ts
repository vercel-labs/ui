// @vitest-environment node
import { createServer, request, type Server } from "node:http"
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
})

test("answers a page on another local port, and no other site", async () => {
  await start()
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/__ui-sdk/page`
  const preflight = (origin: string) =>
    fetch(url, {
      method: "OPTIONS",
      headers: { Origin: origin, "Access-Control-Request-Method": "POST" },
    })
  const local = await preflight("http://localhost:3000")
  expect(local.status).toBe(204)
  expect(local.headers.get("access-control-allow-origin")).toBe("http://localhost:3000")
  expect((await preflight("https://example.com")).status).toBe(403)
})

test("turns away a host that isn't this machine", async () => {
  await start()
  const { port } = server.address() as AddressInfo
  const status = await new Promise<number>((resolve) => {
    const req = request(
      {
        port,
        host: "127.0.0.1",
        path: "/__ui-sdk/mcp",
        method: "POST",
        headers: { Host: "example.com", "Content-Type": "application/json" },
      },
      (res) => resolve(res.statusCode!),
    )
    req.end(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" }))
  })
  expect(status).toBe(403)
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

test("answers only this machine, whatever the headers say", async () => {
  const { handle } = createDevServer()
  const status = async (path: string, remoteAddress: string) => {
    const res = {
      statusCode: 0,
      writableEnded: false,
      setHeader() {},
      on() {},
      end() {
        this.writableEnded = true
      },
    }
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping", page: "a" })
    await handle(
      Object.assign([body], {
        method: "POST",
        url: `/__ui-sdk/${path}`,
        headers: {
          host: "localhost:5173",
          "content-type": "application/json",
          "x-forwarded-for": "127.0.0.1",
        },
        socket: { remoteAddress },
      }) as never,
      res,
    )
    return res.statusCode
  }
  expect(await status("mcp", "192.168.1.20")).toBe(403)
  expect(await status("page", "::ffff:192.168.1.20")).toBe(403)
  expect(await status("mcp", "::ffff:127.0.0.1")).toBe(200)
})

test("turns away a body over a megabyte", async () => {
  const { post } = await start()
  expect((await post("mcp", { pad: "x".repeat(1_100_000) })).status).toBe(413)
})

test("moves to a free port when another server has localhost's ::1", async () => {
  const taken = createServer()
  await new Promise<void>((resolve) => taken.listen(0, "::1", resolve))
  const { port } = taken.address() as AddressInfo
  const { startDevServer } = await import("../src/page/agent/dev-server")
  const actual = await startDevServer(port)
  taken.close()
  expect(actual).not.toBe(port)
})
