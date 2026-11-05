import { createAgent } from "./agent"

type Call = { id: number; name: "snapshot" | "act" | "query"; input: never }
type Answer = { id: number; result?: unknown; error?: string }

const key = Symbol.for("ui-sdk.dev")

async function connect() {
  const agent = createAgent()
  const page = Math.random().toString(36).slice(2)
  let answer: Answer | undefined
  let wait = 0
  for (;;) {
    try {
      const response = await fetch("/__ui-sdk/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, answer }),
      })
      if (response.status === 404) return
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

const scope = globalThis as { [key]?: true }
if (typeof document !== "undefined" && !scope[key]) {
  scope[key] = true
  connect()
}

export {}
