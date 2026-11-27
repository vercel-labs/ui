// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { checkbox } from "../src/components/checkbox/checkbox"
import { switchPrimitive } from "../src/components/switch/switch"
import { bind } from "../src/foundation/kernel/part"
import { createAgent } from "../src/page/agent/agent"

let cleanups: (() => void)[] = []

afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

function mount(
  instance: {
    part: (slot: "root") => Parameters<typeof bind>[0]
    destroy: () => void
  },
  label: string
) {
  const el = document.createElement("button")
  el.setAttribute("aria-label", label)
  document.body.append(el)
  cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
}

test("a switch or checkbox lists no value when it submits the default", () => {
  const agent = createAgent()
  mount(switchPrimitive({ id: "banner", defaultChecked: true }), "Banner")
  mount(checkbox({ id: "terms" }), "Terms")
  const [banner, terms] = agent.snapshot()
  expect(banner).toMatchObject({ label: "Banner", checked: true })
  expect(terms).toMatchObject({ label: "Terms", checked: false })
  expect(banner).not.toHaveProperty("value")
  expect(terms).not.toHaveProperty("value")
})

test("a checkbox the page gives a value keeps it", () => {
  const agent = createAgent()
  mount(checkbox({ id: "beta", value: "beta" }), "Beta")
  expect(agent.snapshot()[0]).toMatchObject({ checked: false, value: "beta" })
})
