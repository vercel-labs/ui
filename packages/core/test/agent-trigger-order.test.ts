// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { popover } from "../src/components/popover/popover"
import { bind } from "../src/foundation/kernel/part"
import { createAgent } from "../src/page/agent/agent"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

test("a closed popup lists its triggers in page order, whatever order they bind in", () => {
  const instance = popover({ id: "details" })
  const [a, b] = ["Open a", "Open b"].map((text) => {
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = text
    return el
  })
  const content = Object.assign(document.createElement("div"), {
    getAnimations: () => [],
  })
  content.setAttribute("aria-label", "Details")
  document.body.append(content)
  cleanups.push(
    bind(instance.part("trigger", { id: "b" }), b),
    bind(instance.part("trigger", { id: "a" }), a),
    bind(instance.part("content"), content),
    () => instance.destroy()
  )
  const entry = createAgent()
    .snapshot()
    .find((found) => found.component === "popover")
  expect(entry?.buttons).toEqual(["Open a", "Open b"])
})
