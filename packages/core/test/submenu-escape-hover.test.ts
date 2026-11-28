// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { menu } from "../src/components/menu/menu"
import { mount } from "../src/testing/mount"

const unmounts: (() => void)[] = []
afterEach(() => {
  unmounts.splice(0).forEach((unmount) => unmount())
  document.body.replaceChildren()
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

test("a submenu opened by a click and closed with Escape before the hover delay ends stays closed", async () => {
  const reasons: string[] = []
  const root = mount(
    menu,
    { delay: 300 },
    `<div><trigger>Edit</trigger><content><item value="undo">Undo</item><div data-submenu></div></content></div>`
  )
  const sub = mount(
    menu,
    {
      parent: root.api,
      onOpenChange: (open: boolean, details: { reason: string }) => {
        reasons.push(`${open} ${details.reason}`)
      },
    },
    `<span><trigger>Find</trigger><content><item value="find">Find…</item></content></span>`
  )
  unmounts.push(sub.unmount, root.unmount)
  root.part("content")!.querySelector("[data-submenu]")!.append(sub.root)
  await root.click(root.part("trigger")!)
  await root.hover(sub.part("trigger")!)
  await root.click(sub.part("trigger")!)
  await root.keys("Escape")
  await wait(400)
  expect(reasons).toEqual(["true trigger-press", "false escape-key"])
  expect(sub.state.open).toBe(false)
  expect(root.state.open).toBe(true)
})
