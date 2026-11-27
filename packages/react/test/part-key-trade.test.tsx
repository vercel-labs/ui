// @vitest-environment jsdom
import { definePrimitive } from "@ui-sdk/core"
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { createParts } from "../src/primitive"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

function primitive(asleep: boolean, log: string[]) {
  const hook = (
    el: HTMLElement,
    part: { key: string; props: { tag?: string } }
  ) => {
    log.push(`${el.textContent} key=${part.key} tag=${part.props.tag}`)
  }
  return definePrimitive({
    name: asleep ? "key-trade-asleep" : "key-trade",
    state: () => ({}),
    api: () => ({}),
    ...(asleep ? { asleep: () => true } : {}),
    slots: (slot) => ({
      root: slot({ role: "list" }),
      title: slot({
        props: { value: "string", tag: "value" },
        ...(asleep ? { asleep: hook } : { bind: hook }),
      }),
    }),
    agent: { actions: [] },
  })
}

test.each([false, true])(
  "parts that trade keys in one update bind with their own props (asleep %s)",
  async (asleep) => {
    const log: string[] = []
    const P = createParts(primitive(asleep, log), { root: "div", title: "div" })
    let swap!: (swapped: boolean) => void
    function View() {
      const [swapped, setSwapped] = React.useState(false)
      swap = setSwapped
      return (
        <P.Root>
          <P.Title value={swapped ? "a" : undefined} tag="A">
            A
          </P.Title>
          <P.Title value={swapped ? undefined : "b"} tag="B">
            B
          </P.Title>
        </P.Root>
      )
    }
    const container = document.body.appendChild(document.createElement("div"))
    root = createRoot(container)
    await React.act(async () => root!.render(<View />))
    log.length = 0
    await React.act(async () => swap(true))
    expect(log).toEqual(["A key=a tag=A", "B key= tag=B"])
    log.length = 0
    await React.act(async () => swap(false))
    expect(log).toEqual(["A key= tag=A", "B key=b tag=B"])
  }
)
