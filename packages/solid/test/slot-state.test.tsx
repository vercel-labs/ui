import { definePrimitive, selects } from "@ui-sdk/core"
import { render } from "@solidjs/web"
import { createMemo, createSignal, flush } from "solid-js"
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

const selectable = definePrimitive({
  name: "selectable-cell",
  state: (_options: {}) => ({ active: "a" }),
  api: ({ store }) => ({
    activate: (active: string) => store.set({ active }),
  }),
  slots: (slot) => ({
    cell: slot<{ value: string }, { active: boolean }>({
      props: { value: "string" },
      selects: selects({ active: ({ props }) => [props.value] }),
      present: () => true,
      attrs: (state, { props }) => ({
        "data-active": state.active === props.value ? "" : undefined,
      }),
    }),
  }),
})

test("a part keeps following props after the first scope that tracked it re-runs with a new closure", () => {
  let instance!: ReturnType<typeof selectable>
  const [bump, setBump] = createSignal(0)
  const [value, setValue] = createSignal("a")
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(selectable, () => ({}))
    instance = handle.instance
    const shown = createMemo(() => {
      bump()
      return handle.present("cell", () => ({ value: value() }))
    })
    const props = handle.slot("cell", () => ({ value: value() }))
    return <div {...props} data-shown={String(shown())} />
  }, root)
  flush()

  setBump(1)
  flush()
  setValue("b")
  flush()
  instance.api.activate("c")
  flush()
  instance.api.activate("b")
  flush()
  expect(root.firstElementChild?.hasAttribute("data-active")).toBe(true)
  dispose()
})

const styled = definePrimitive({
  name: "styled-marker",
  state: (_options: {}) => ({ x: 0 }),
  api: ({ store }) => ({
    move: (x: number) => store.set({ x }),
  }),
  slots: (slot) => ({
    marker: slot<{}, { x: number }>({
      state: (state) => ({ x: state.x }),
      attrs: () => ({ style: "--own:1" }),
    }),
  }),
})

test("a style function runs once per change on a part that writes its own style", () => {
  let instance!: ReturnType<typeof styled>
  let calls = 0
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(styled, () => ({}))
    instance = handle.instance
    return usePart(handle, "marker", () => ({}), {
      style: (state) => (calls++, { "--user": String(state.x) }),
    })
  }, root)
  flush()
  const el = root.firstElementChild as HTMLElement
  expect(calls).toBe(1)
  expect(el.style.getPropertyValue("--own")).toBe("1")
  expect(el.style.getPropertyValue("--user")).toBe("0")

  instance.api.move(5)
  flush()
  expect(calls).toBe(2)
  expect(el.style.getPropertyValue("--user")).toBe("5")
  dispose()
})
