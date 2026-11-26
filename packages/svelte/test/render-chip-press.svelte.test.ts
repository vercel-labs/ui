import { flushSync, mount, tick, unmount } from "svelte"
import { expect, test } from "vitest"
import { createAgent } from "../src/agent"
import App from "./apps/render-chip-press-app.svelte"

test("a part rendered through a trigger's render presses that trigger", async () => {
  const target = document.body.appendChild(document.createElement("div"))
  const app = mount(App, { target })
  flushSync()
  await tick()
  const agent = createAgent()
  const chip = agent.snapshot().find((entry) => entry.component === "chip")!
  expect(chip.actions).toContain("press")
  const result = await agent.act({
    steps: [{ ref: chip.ref, action: "press" }],
  })
  expect(result.ok).toBe(true)
  expect(
    agent.snapshot().find((entry) => entry.component === "menu")!.open
  ).toBe(true)
  unmount(app)
  target.remove()
})
