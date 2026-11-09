// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { createApp, defineComponent, h, reactive, ref, type App } from "vue"
import { createAgent } from "../src/agent"
import { Input } from "../src/input"
import { createTimeline } from "../src/timeline"

let app: App | undefined
afterEach(() => {
  app?.unmount()
  document.body.replaceChildren()
})

test.each(["raw", "reactive", "ref", "spread"])(
  "a %s agent restores a Vue input through its timeline",
  async (kind) => {
    const element = document.body.appendChild(document.createElement("div"))
    app = createApp(
      defineComponent({
        setup: () => () =>
          h(Input, { defaultValue: "initial", "aria-label": "Value" }),
      })
    )
    app.mount(element)
    const raw = createAgent()
    const agent =
      kind === "reactive"
        ? reactive(raw)
        : kind === "ref"
          ? ref(raw).value
          : kind === "spread"
            ? { ...raw }
            : raw
    const timeline = createTimeline(agent)
    try {
      expect(
        (
          await agent.act({
            steps: [{ ref: "Value", action: "setValue", args: ["next"] }],
          })
        ).ok
      ).toBe(true)
      expect(element.querySelector("input")?.value).toBe("next")
      expect(await timeline.seek(0)).toEqual([])
      expect(element.querySelector("input")?.value).toBe("initial")
    } finally {
      timeline.destroy()
    }
  }
)
