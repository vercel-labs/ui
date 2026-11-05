/// <reference types="node" />
import { agentTools } from "./tools.ts"

// Node's request and response, as much of them as the server reads, so the
// declarations need no Node types.
type NodeRequest = AsyncIterable<string | Uint8Array> & {
  method?: string
  url?: string
  headers: Record<string, string | string[] | undefined>
}
type NodeResponse = {
  statusCode: number
  writableEnded: boolean
  setHeader: (name: string, value: string) => unknown
  end: (body?: string) => unknown
  on: (event: "close", listener: () => void) => unknown
}

type Call = { id: string; name: string; input: unknown }
type Answer = { id: string; result?: unknown; error?: string }
type Page = { id: string; since: number; seen: number; poll?: NodeResponse }
type Message = { jsonrpc: "2.0"; id?: number | string; method: string; params?: Record<string, unknown> }

const base = "/__ui-sdk"
const pollFor = 20_000
const pageGone = pollFor + 5_000
// Under the 60 seconds MCP clients wait for a tool call by default.
const callFor = 45_000

/**
 * The MCP server behind the framework integrations, as Node middleware: a
 * coding agent's tool calls go to `/__ui-sdk/mcp`, and the page open in the
 * browser runs them through its own bridge.
 * @experimental
 */
function createDevServer() {
  const pages = new Map<string, Page>()
  const queue: Call[] = []
  const waiting = new Map<string, { page?: string; resolve: (answer: Answer) => void }>()

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
    const pending = waiting.get(call.id)
    if (pending) pending.page = page.id
    reply(page.poll, 200, call)
    page.poll = undefined
  }

  const call = (name: string, input: unknown) =>
    new Promise<Answer>((resolve) => {
      const id = crypto.randomUUID()
      const timer = setTimeout(() => {
        waiting.delete(id)
        const index = queue.findIndex((queued) => queued.id === id)
        if (index !== -1) queue.splice(index, 1)
        resolve({
          id,
          error: "The page didn't answer. Check that the app is open in a browser tab, then try again.",
        })
      }, callFor)
      waiting.set(id, {
        resolve: (answer) => {
          clearTimeout(timer)
          resolve(answer)
        },
      })
      queue.push({ id, name, input })
      const page = activePage()
      if (page) send(page)
    })

  const poll = (body: { page?: string; answer?: Answer }, res: NodeResponse) => {
    const { answer } = body
    const pending = answer && waiting.get(answer.id)
    if (answer && pending && pending.page === body.page) {
      waiting.delete(answer.id)
      pending.resolve(answer)
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

  const handle = async (req: NodeRequest, res: NodeResponse, next?: () => void) => {
    const path = req.url?.split("?")[0]
    if (path !== `${base}/mcp` && path !== `${base}/page`) return next ? next() : reply(res, 404)
    const origin = allowedOrigin(req)
    if (origin === false) return reply(res, 403)
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Vary", "Origin")
    }
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST")
      res.setHeader("Access-Control-Allow-Headers", "Content-Type")
      return reply(res, 204)
    }
    if (req.method !== "POST") return reply(res, 405)
    if (!String(req.headers["content-type"]).startsWith("application/json")) return reply(res, 403)
    if (path === `${base}/page`) return poll((await read(req)) as never, res)
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

  return { handle }
}

// Another site's page can send a simple POST, and a rebound domain can reach
// localhost: requiring JSON forces a preflight, and only the page's own origin
// or another port on this machine gets an answer. MCP clients send no origin.
function allowedOrigin({ headers }: NodeRequest) {
  const host = String(headers.host)
  if (!local(host)) return false
  if (headers.origin === undefined) return undefined
  const origin = String(headers.origin)
  try {
    const { host: from, hostname } = new URL(origin)
    return from === host || ["localhost", "127.0.0.1", "[::1]"].includes(hostname) ? origin : false
  } catch {
    return false
  }
}

function local(host: string) {
  const name = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "")
  return name === "localhost" || name.endsWith(".localhost") || /^[\d.]+$/.test(name) || name.includes(":")
}

function text(value: string, isError = false) {
  return { content: [{ type: "text", text: value }], isError }
}

async function read(req: NodeRequest) {
  const decoder = new TextDecoder()
  let body = ""
  try {
    for await (const chunk of req)
      body += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true })
    body += decoder.decode()
    const value: unknown = JSON.parse(body || "{}")
    return typeof value === "object" && value !== null ? value : {}
  } catch {
    return {}
  }
}

function reply(res: NodeResponse, status: number, body?: unknown) {
  if (res.writableEnded) return
  res.statusCode = status
  if (body === undefined) return res.end()
  res.setHeader("Content-Type", "application/json")
  res.setHeader("Cache-Control", "no-store")
  res.end(JSON.stringify(body))
}

const started = Symbol.for("ui-sdk.dev-server")

/**
 * Starts `createDevServer` on its own port on this machine only, once per
 * process, for frameworks whose dev server takes no middleware. Resolves to
 * the port, `port` unless it's taken. The page connects to it across ports.
 * @experimental
 */
function startDevServer(port = 3399) {
  const scope = globalThis as { [started]?: Promise<number> }
  scope[started] ??= import("node:http").then(async ({ createServer }) => {
    const { handle } = createDevServer()
    const listen = (address: string, at: number) =>
      new Promise<number>((resolve, reject) => {
        const server = createServer(handle)
        server.once("error", reject)
        server.listen(at, address, () => {
          server.unref()
          resolve((server.address() as { port: number }).port)
        })
      })
    const actual = await listen("127.0.0.1", port).catch(() => listen("127.0.0.1", 0))
    // Some clients try localhost as ::1 first.
    await listen("::1", actual).catch(() => {})
    const url = `http://localhost:${actual}${base}/mcp`
    if (actual === port || !port) console.log(`ui-sdk: MCP for coding agents at ${url}`)
    else console.warn(`ui-sdk: port ${port} is in use, so the MCP for coding agents is at ${url}`)
    return actual
  })
  return scope[started]
}

export { createDevServer, startDevServer }
