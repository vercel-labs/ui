// @vitest-environment jsdom
// Every popup that moves focus gives it back the same way, whichever opened
// it and whatever happened to its trigger meanwhile.
import { afterEach, describe, expect, test } from "vitest"
import { alertDialog } from "../src/components/dialog/alert-dialog"
import { datePicker } from "../src/components/date-picker/date-picker"
import { dialog } from "../src/components/dialog/dialog"
import { drawer } from "../src/components/drawer/drawer"
import { menu } from "../src/components/menu/menu"
import { popover } from "../src/components/popover/popover"
import { select } from "../src/components/select/select"
import type { Primitive } from "../src/foundation/kernel/primitive-types"
import { mount } from "../src/testing/mount"

type PopupCase = { name: string; primitive: Primitive; trigger: string; content: string; viewport?: boolean }

const popups: PopupCase[] = [
  { name: "popover", primitive: popover, trigger: "Share", content: `<button>Copy link</button>` },
  {
    name: "dialog",
    primitive: dialog,
    trigger: "Rename",
    content: `<title>Rename</title><button>Save</button><close>Cancel</close>`,
  },
  {
    name: "alert dialog",
    primitive: alertDialog,
    trigger: "Delete",
    content: `<title>Delete?</title><close>Cancel</close>`,
  },
  {
    name: "drawer",
    primitive: drawer,
    trigger: "Filters",
    content: `<title>Filters</title><close>Done</close>`,
    viewport: true,
  },
  { name: "menu", primitive: menu, trigger: "Actions", content: `<item value="copy">Copy</item>` },
  {
    name: "select",
    primitive: select,
    trigger: "Fruit",
    content: `<list><item value="apple">Apple</item></list>`,
  },
  { name: "date picker", primitive: datePicker, trigger: "Pick a date", content: `<grid></grid>` },
]

const markup = ({ trigger, content, viewport }: PopupCase) => {
  const popup = `<content>${content}</content>`
  return `<div><button>Before</button><trigger>${trigger}</trigger>${viewport ? `<viewport>${popup}</viewport>` : popup}<button>After</button></div>`
}

// Drawer measures itself, which a DOM made for tests can't.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

let unmount: (() => void) | undefined
afterEach(() => {
  unmount?.()
  unmount = undefined
  document.body.replaceChildren()
})

function mountPopup(popup: PopupCase, options: object = {}) {
  const view = mount(popup.primitive, options as never, markup(popup))
  unmount = view.unmount
  const api = view.api as { setOpen: (open: boolean) => void }
  const button = (text: string) =>
    [...view.root.querySelectorAll<HTMLElement>("button")].find((el) => el.textContent === text)!
  const isOpen = () => (view.state as { open: boolean }).open
  return { view, api, button, isOpen, trigger: () => view.part("trigger" as never)! }
}

const focused = () => document.activeElement?.textContent

describe.each(popups)("$name", (popup) => {
  test("Escape gives focus back to the trigger a key opened it from", async () => {
    const { view, trigger, isOpen } = mountPopup(popup)
    trigger().focus()
    await view.keys("Enter")
    expect(isOpen()).toBe(true)
    await view.keys("Escape")
    expect(isOpen()).toBe(false)
    expect(focused()).toBe(popup.trigger)
  })

  test("Escape gives focus back to the trigger a press opened it from", async () => {
    const { view, trigger, isOpen } = mountPopup(popup)
    await view.click(trigger())
    expect(isOpen()).toBe(true)
    await view.keys("Escape")
    expect(focused()).toBe(popup.trigger)
  })

  test("closing after its trigger left the page gives focus to what came after it", async () => {
    const { view, trigger, isOpen } = mountPopup(popup)
    trigger().focus()
    await view.keys("Enter")
    trigger().remove()
    await view.keys("Escape")
    expect(isOpen()).toBe(false)
    expect(focused()).toBe("After")
  })

  test("opened from code, closing gives focus back to what had it", async () => {
    const { view, api, button, isOpen } = mountPopup(popup)
    button("Before").focus()
    api.setOpen(true)
    await view.settle()
    expect(isOpen()).toBe(true)
    await view.keys("Escape")
    expect(focused()).toBe("Before")
  })

  test("open from the start, closing gives focus back to what had it", async () => {
    const before = document.body.appendChild(
      Object.assign(document.createElement("button"), { textContent: "Elsewhere" }),
    )
    before.focus()
    const { view, api, isOpen } = mountPopup(popup, { defaultOpen: true })
    await view.settle()
    expect(isOpen()).toBe(true)
    api.setOpen(false)
    await view.settle()
    expect(focused()).toBe("Elsewhere")
  })

  test("closing from code while focus is outside it leaves focus alone", async () => {
    const { view, api, button, trigger, isOpen } = mountPopup(popup)
    trigger().focus()
    await view.keys("Enter")
    expect(isOpen()).toBe(true)
    button("After").focus()
    api.setOpen(false)
    await view.settle()
    expect(focused()).toBe("After")
  })
})
