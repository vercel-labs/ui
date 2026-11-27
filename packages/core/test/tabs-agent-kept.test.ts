// @vitest-environment jsdom
// A panel an agent's change leaves is present at every step of the change,
// so an adapter that renders as the state changes never unmounts it.
import { expect, test } from "vitest"
import { tabs } from "../src/components/tabs/tabs"
import { withSource } from "../src/foundation/kernel/details"
import { bind, present, subscribe } from "../src/foundation/kernel/part"

Element.prototype.getAnimations ??= () => []

function mount(options: Parameters<typeof tabs>[0]) {
  const instance = tabs(options)
  const panel = (value: string) => instance.part("panel", { value })
  const offs = ["a", "b"].map((value) =>
    bind(panel(value), document.body.appendChild(document.createElement("div")))
  )
  return { instance, panel, off: () => offs.forEach((off) => off()) }
}

test("a bound panel an agent's change leaves never reads absent", () => {
  const { instance, panel, off } = mount({ id: "kept", defaultValue: "a" })
  const seen: boolean[] = []
  const stop = subscribe(panel("a"), () => seen.push(present(panel("a"))))
  withSource("agent", () => instance.api.select("b"))
  expect(seen.length).toBeGreaterThan(0)
  expect(seen).not.toContain(false)
  expect(present(panel("a"))).toBe(true)
  stop()
  off()
})

test("a change that is refused keeps nothing", () => {
  const { instance, off } = mount({
    id: "refused",
    defaultValue: "a",
    onValueChange: (_value, details) => details.cancel(),
  })
  expect(withSource("agent", () => instance.api.select("b"))).toBe(false)
  expect(instance.get().kept).toEqual([])
  off()
})
