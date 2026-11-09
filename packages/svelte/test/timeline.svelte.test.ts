import { expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { createTimeline } from "../src/timeline"

test.each(["spread", "reactive"])(
  "a timeline accepts an agent in a %s object",
  (mode) => {
    const agent = createAgent()
    const reactive = $state({ ...agent })
    const owner = mode === "spread" ? { ...agent } : reactive
    expect(owner.act).toBe(agent.act)
    const timeline = createTimeline(owner)
    expect(timeline.entries()).toEqual([])
    timeline.destroy()
  }
)
