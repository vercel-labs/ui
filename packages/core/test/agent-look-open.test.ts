// @vitest-environment jsdom
// An agent's setValue opens only a list whose items show while it's open: not
// a component without an open state, and it doesn't wait on one kept closed.
import { afterEach, expect, test } from "vitest"
import { createAgent } from "../src/page/agent/agent"
import { createChange } from "../src/foundation/kernel/input-source"
import { bind } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

function mount(open: boolean | undefined, opens: boolean[]) {
  const picker = definePrimitive({
    name: "picker",
    options: { value: "value", onValueChange: "callback" },
    controlled: ["value"],
    state: (options: {
      value?: string
      onValueChange?: (value: string) => void
    }) => ({
      value: options.value ?? "",
      ...(open === undefined ? {} : { open }),
    }),
    api: (context) => {
      const change = createChange(context)
      return {
        setValue: (value: string) =>
          change("value", value, { reason: "imperative" }),
        setOpen: (next: boolean) => opens.push(next),
      }
    },
    slots: (slot) => ({
      root: slot({ attrs: () => ({ role: "group", "aria-label": "Picker" }) }),
    }),
    agent: { actions: ["setValue"] },
  })
  const instance = picker({ id: "picker" })
  const el = document.body.appendChild(document.createElement("div"))
  cleanups.push(bind(instance.part("root"), el), () => instance.destroy())
  return instance
}

test("a component without an open state isn't opened to look", async () => {
  const opens: boolean[] = []
  const instance = mount(undefined, opens)
  const outcome = await createAgent().act({
    steps: [{ ref: "Picker", action: "setValue", args: ["two"] }],
  })
  expect(outcome.ok).toBe(true)
  expect(instance.get().value).toBe("two")
  expect(opens).toEqual([])
})

test("a list that stays closed isn't waited on, and is asked once", async () => {
  const opens: boolean[] = []
  mount(false, opens)
  const started = performance.now()
  await createAgent().act({
    steps: [{ ref: "Picker", action: "setValue", args: ["two"] }],
  })
  expect(performance.now() - started).toBeLessThan(800)
  expect(opens.filter(Boolean)).toHaveLength(1)
})
