import { definePrimitive } from "@ui-sdk/core"
import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { expect, test } from "vitest"
import { usePart, usePrimitive } from "../src/use-primitive"

type Point = { x: number }

const plot = definePrimitive({
  name: "derived-objects",
  state: (_options: {}) => ({ x: 0, title: "" }),
  api: ({ store }) => ({
    move: (x: number) => store.set({ x }),
    rename: (title: string) => store.set({ title }),
  }),
  slots: (slot) => ({
    marker: slot<{}, { point: Point; points: Point[] }>({
      state: (state) => ({ point: { x: state.x }, points: [{ x: state.x }] }),
    }),
  }),
})

test("state derived as new objects renders once per change to their values", () => {
  let instance!: ReturnType<typeof plot>
  let renders = 0
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(plot, () => ({}))
    instance = handle.instance
    return usePart(handle, "marker", () => ({}), {
      class: (state) => (renders++, `x-${state.point.x}-${state.points[0]!.x}`),
    })
  }, root)
  flush()
  expect(root.querySelector(".x-0-0")).not.toBeNull()
  expect(renders).toBe(1)

  instance.api.move(4)
  flush()
  expect(root.querySelector(".x-4-4")).not.toBeNull()
  expect(renders).toBe(2)

  instance.api.rename("Sprint")
  flush()
  expect(renders).toBe(2)
  dispose()
})

const meter = definePrimitive({
  name: "state-from-props",
  state: (_options: {}) => ({ amount: 5 }),
  api: () => ({}),
  slots: (slot) => ({
    text: slot<{ unit?: string }, { label: string }>({
      props: { unit: "value" },
      state: (state, { props }) => ({
        label: `${state.amount}${props.unit ?? ""}`,
      }),
    }),
  }),
})

test("two elements of one part each read the state their own props make", () => {
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(meter, () => ({}))
    return [
      usePart(handle, "text", () => ({}), {
        children: (state) => state.label,
      }),
      usePart(handle, "text", () => ({ unit: "kg" }), {
        children: (state) => state.label,
      }),
    ]
  }, root)
  flush()
  expect([...root.children].map((el) => el.textContent)).toEqual(["5", "5kg"])
  dispose()
})
