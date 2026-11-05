import { createAgent } from "./agent"

type Agent = ReturnType<typeof createAgent>
type Call = { id: string; name: "snapshot" | "act" | "query"; input: never }
type Answer = { id: string; result?: unknown; error?: string }

const key = Symbol.for("ui-sdk.dev")

async function connect(agent: Agent, page: string, signal?: AbortSignal) {
  let answer: Answer | undefined
  let wait = 0
  while (!signal?.aborted) {
    try {
      const response = await fetch("/__ui-sdk/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, answer }),
        signal,
      })
      if (response.status === 403 || response.status === 404) return
      if (response.status !== 200 && response.status !== 204) throw response
      answer = undefined
      wait = 0
      if (response.status === 204) continue
      const call = (await response.json()) as Call
      try {
        answer = { id: call.id, result: await agent[call.name](call.input) }
      } catch (error) {
        answer = { id: call.id, error: String((error as Error)?.message ?? error) }
      }
    } catch {
      wait = Math.min(wait + 1_000, 5_000)
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
  }
}

function start() {
  const agent = createAgent()
  const page = Math.random().toString(36).slice(2)
  const locks = navigator.locks as LockManager | undefined
  if (!locks) return connect(agent, page)

  // Each poll holds one of the browser's six connections to the dev server, so
  // one tab polls at a time: the newest page, then the next in line when it
  // closes. A frame waits for the page around it.
  const claim = (steal: boolean) => {
    const stop = new AbortController()
    locks
      .request("ui-sdk.dev", { steal }, () => connect(agent, page, stop.signal))
      .catch(() => {
        stop.abort()
        claim(false)
      })
  }
  claim(window === window.top)
}

const scope = globalThis as { [key]?: true }
if (typeof document !== "undefined" && !scope[key]) {
  scope[key] = true
  start()
}

export {}
