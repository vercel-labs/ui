import { definePrimitive } from "@ui-sdk/core"
import { render } from "@solidjs/web"
import { createMemo, createSignal, flush } from "solid-js"
import { expect, test } from "vitest"
import { usePrimitive } from "../src/use-primitive"

const panel = definePrimitive({
  name: "presence-panel",
  state: (_options: {}) => ({ open: false, title: "" }),
  api: ({ store }) => ({
    setOpen: (open: boolean) => store.set({ open }),
    rename: (title: string) => store.set({ title }),
  }),
  slots: (slot) => ({
    content: slot<{ keep?: boolean }, { title: string }>({
      props: { keep: "boolean" },
      state: (state) => ({ title: state.title }),
      present: (state, { props }) => state.open || !!props.keep,
    }),
  }),
})

test("a part's presence is read again only when it changes", () => {
  let instance!: ReturnType<typeof panel>
  let reads = 0
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(panel, () => ({}))
    instance = handle.instance
    const shown = createMemo(() => {
      reads++
      return handle.present("content")
    })
    return <div data-shown={String(shown())} />
  }, root)
  flush()
  expect(reads).toBe(1)

  instance.api.setOpen(true)
  flush()
  expect(root.firstElementChild?.getAttribute("data-shown")).toBe("true")
  for (const title of ["a", "b", "c"]) {
    instance.api.rename(title)
    flush()
  }
  expect(reads).toBe(2)

  instance.api.setOpen(false)
  flush()
  expect(root.firstElementChild?.getAttribute("data-shown")).toBe("false")
  expect(reads).toBe(3)
  dispose()
})

test("each reader of a part's presence hears it with its own props", () => {
  let instance!: ReturnType<typeof panel>
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(panel, () => ({}))
    instance = handle.instance
    const plain = createMemo(() => handle.present("content", () => ({})))
    const kept = createMemo(() =>
      handle.present("content", () => ({ keep: true }))
    )
    return <div data-shown={`${plain()} ${kept()}`} />
  }, root)
  flush()
  expect(root.firstElementChild?.getAttribute("data-shown")).toBe("false true")
  instance.api.setOpen(true)
  flush()
  expect(root.firstElementChild?.getAttribute("data-shown")).toBe("true true")
  dispose()
})

test("a part's presence follows a prop its answer reads only some of the time", () => {
  let instance!: ReturnType<typeof panel>
  const [keep, setKeep] = createSignal(false)
  const root = document.createElement("div")
  const dispose = render(() => {
    const handle = usePrimitive(panel, () => ({}))
    instance = handle.instance
    const shown = createMemo(() =>
      handle.present("content", () => ({
        get keep() {
          return keep()
        },
      }))
    )
    return <div data-shown={String(shown())} />
  }, root)
  flush()
  instance.api.setOpen(true)
  flush()
  setKeep(true)
  flush()
  instance.api.setOpen(false)
  flush()
  setKeep(false)
  flush()
  expect(root.firstElementChild?.getAttribute("data-shown")).toBe("false")
  dispose()
})
