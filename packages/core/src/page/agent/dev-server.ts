/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "node:http"
import type { AddressInfo } from "node:net"
import { agentTools } from "./tools"

type Call = { id: number; name: string; input: unknown }
type Answer = { id: number; result?: unknown; error?: string }
type Page = { id: string; since: number; seen: number; poll?: ServerResponse }
type Message = { jsonrpc: "2.0"; id?: number | string; method: string; params?: Record<string, unknown> }

const base = "/__ui-sdk"
const pollFor = 20_000
const pageGone = pollFor + 5_000
const callFor = 60_000

/**
 * The MCP server behind the framework integrations, as Node middleware: a
 * coding agent's tool calls go to `/__ui-sdk/mcp`, and the page open in the
 * browser runs them through its own bridge.
 * @experimental
 */
function createDevServer() {
  const pages = new Map<string, Page>()
  const queue: Call[] = []
  const waiting = new Map<number, (answer: Answer) => void>()
  let nextId = 1

  const activePage = () => {
    let active: Page | undefined
    for (const page of pages.values()) {
      if (Date.now() - page.seen > pageGone) pages.delete(page.id)
      else if (!active || page.since > active.since) active = page
    }
    return active
  }

  const send = (page: Page) => {
    if (!page.poll || page !== activePage() || !queue.length) return
    const call = queue.shift()!
    reply(page.poll, 200, call)
    page.poll = undefined
  }

  const call = (name: string, input: unknown) =>
    new Promise<Answer>((resolve) => {
      const id = nextId++
      const timer = setTimeout(() => {
        waiting.delete(id)
        const index = queue.findIndex((queued) => queued.id === id)
        if (index !== -1) queue.splice(index, 1)
        resolve({
          id,
          error: "The page didn't answer. Check that the app is open in a browser tab, then try again.",
        })
      }, callFor)
      waiting.set(id, (answer) => {
        clearTimeout(timer)
        resolve(answer)
      })
      queue.push({ id, name, input })
      const page = activePage()
      if (page) send(page)
    })

  const poll = (body: { page?: string; answer?: Answer }, res: ServerResponse) => {
    if (body.answer) {
      waiting.get(body.answer.id)?.(body.answer)
      waiting.delete(body.answer.id)
    }
    if (typeof body.page !== "string") return reply(res, 400, { error: "page is required" })
    const page = pages.get(body.page) ?? { id: body.page, since: Date.now(), seen: 0 }
    pages.set(page.id, page)
    page.seen = Date.now()
    if (page.poll) reply(page.poll, 204)
    page.poll = res
    const timer = setTimeout(() => {
      if (page.poll !== res) return
      page.poll = undefined
      reply(res, 204)
    }, pollFor)
    res.on("close", () => {
      clearTimeout(timer)
      if (page.poll !== res) return
      page.poll = undefined
      // A poll that ends unanswered is a tab that closed or navigated away.
      if (!res.writableEnded) pages.delete(page.id)
    })
    send(page)
  }

  const mcp = async (message: Message) => {
    const { method, params = {} } = message
    if (method === "initialize")
      return {
        protocolVersion: params.protocolVersion ?? "2025-06-18",
        capabilities: { tools: {} },
        serverInfo: { name: "ui-sdk", version: "0.0.0" },
        instructions:
          "Reads and operates the ui-sdk components on the page open in the browser. Start with snapshot or query, then act.",
      }
    if (method === "ping") return {}
    if (method === "tools/list")
      return {
        tools: agentTools.map((tool) => ({
          ...tool,
          annotations: { readOnlyHint: tool.name !== "act", openWorldHint: false },
        })),
      }
    if (method === "tools/call") {
      const name = String(params.name)
      if (!agentTools.some((tool) => tool.name === name)) throw new Error(`Unknown tool: ${name}`)
      if (!activePage())
        return text("No page is connected. Open the app in a browser tab, then try again.", true)
      const answer = await call(name, params.arguments ?? {})
      return answer.error === undefined ? text(JSON.stringify(answer.result)) : text(answer.error, true)
    }
    throw new Error(`Unknown method: ${method}`)
  }

  const handle = async (req: IncomingMessage, res: ServerResponse, next?: () => void) => {
    const path = req.url?.split("?")[0]
    if (path === `${base}/mcp`) {
      if (req.method !== "POST") return reply(res, 405)
      const message = (await read(req)) as Message
      if (message.id === undefined) return reply(res, 202)
      try {
        return reply(res, 200, { jsonrpc: "2.0", id: message.id, result: await mcp(message) })
      } catch (error) {
        return reply(res, 200, {
          jsonrpc: "2.0",
          id: message.id,
          error: { code: -32601, message: (error as Error).message },
        })
      }
    }
    if (path === `${base}/page` && req.method === "POST") return poll((await read(req)) as never, res)
    if (next) next()
    else reply(res, 404)
  }

  return { handle }
}

function text(value: string, isError = false) {
  return { content: [{ type: "text", text: value }], isError }
}

async function read(req: IncomingMessage) {
  let body = ""
  for await (const chunk of req) body += chunk
  try {
    return JSON.parse(body || "{}")
  } catch {
    return {}
  }
}

function reply(res: ServerResponse, status: number, body?: unknown) {
  if (res.writableEnded) return
  res.statusCode = status
  if (body === undefined) return res.end()
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(body))
}

const started = Symbol.for("ui-sdk.dev-server")

/**
 * Starts `createDevServer` on its own port, once per process, for frameworks
 * whose dev server takes no middleware. Resolves to the port, which the
 * framework proxies `/__ui-sdk/*` to.
 * @experimental
 */
function startDevServer() {
  const scope = globalThis as { [started]?: Promise<number> }
  scope[started] ??= import("node:http").then(
    ({ createServer }) =>
      new Promise<number>((resolve, reject) => {
        const server = createServer(createDevServer().handle)
        server.once("error", reject)
        server.listen(0, "127.0.0.1", () => {
          server.unref()
          resolve((server.address() as AddressInfo).port)
        })
      }),
  )
  return scope[started]
}

export { createDevServer, startDevServer }
