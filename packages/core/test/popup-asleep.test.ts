// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest"
import { alertDialog, dialog } from "../src/components/dialog/dialog"
import { drawer } from "../src/components/drawer/drawer"
import { hoverCard } from "../src/components/hover-card/hover-card"
import { popover } from "../src/components/popover/popover"
import {
  attrs,
  bind,
  handlers,
  partState,
  present,
} from "../src/foundation/kernel/part"

Element.prototype.getAnimations ??= () => []

afterEach(() => document.body.replaceChildren())

const asleep = (part: unknown) => (part as { api?: unknown }).api === undefined

describe("closed popups stay asleep until used", () => {
  test("popover renders its trigger and wakes on press or shortcut", () => {
    const instance = popover({ id: "pop" })
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Info"
    const trigger = instance.part("trigger", { id: "t", shortcut: "mod+i" })
    bind(trigger, el)
    expect(attrs(trigger)).toMatchObject({
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
    })
    expect(present(instance.part("content"))).toBe(false)
    expect(partState(instance.part("content"))).toMatchObject({ open: false })
    expect(asleep(trigger)).toBe(true)

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "i", code: "KeyI", ctrlKey: true })
    )
    expect(asleep(trigger)).toBe(false)
    expect(instance.get().open).toBe(true)
  })

  test("hover-card renders its trigger and wakes on pointer enter", () => {
    const instance = hoverCard({ id: "card" })
    const el = document.body.appendChild(document.createElement("a"))
    el.textContent = "Profile"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    expect(attrs(trigger)).toMatchObject({ "data-closed": "" })
    expect(present(instance.part("content"))).toBe(false)
    expect(asleep(trigger)).toBe(true)

    handlers(trigger).pointerenter!(new MouseEvent("pointerenter"))
    expect(asleep(trigger)).toBe(false)
  })

  test("dialog stays asleep across trigger, backdrop and content", () => {
    const instance = dialog({ id: "dlg" })
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Open"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    expect(attrs(trigger)).toMatchObject({ "aria-haspopup": "dialog" })
    expect(present(instance.part("backdrop"))).toBe(false)
    expect(present(instance.part("content"))).toBe(false)
    expect(asleep(trigger)).toBe(true)

    handlers(trigger).click!(new MouseEvent("click"))
    expect(asleep(trigger)).toBe(false)
    expect(instance.get().open).toBe(true)
  })

  test("alert-dialog stays asleep across trigger, backdrop and content", () => {
    const instance = alertDialog({ id: "alert" })
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Delete"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    expect(attrs(trigger)).toMatchObject({ "aria-haspopup": "dialog" })
    expect(present(instance.part("backdrop"))).toBe(false)
    expect(present(instance.part("content"))).toBe(false)
    expect(asleep(trigger)).toBe(true)

    handlers(trigger).click!(new MouseEvent("click"))
    expect(asleep(trigger)).toBe(false)
    expect(instance.get().open).toBe(true)
  })

  test("drawer stays asleep across trigger, backdrop, viewport and content", () => {
    const instance = drawer({ id: "drw" })
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Sheet"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    expect(attrs(trigger)).toMatchObject({ "aria-haspopup": "dialog" })
    expect(present(instance.part("backdrop"))).toBe(false)
    expect(present(instance.part("viewport"))).toBe(false)
    expect(present(instance.part("content"))).toBe(false)
    expect(asleep(trigger)).toBe(true)

    handlers(trigger).click!(new MouseEvent("click"))
    expect(asleep(trigger)).toBe(false)
    expect(instance.get().open).toBe(true)
  })

  test("a shortcut part inherits its trigger's shortcut while asleep", () => {
    const instance = dialog({ id: "cmd" })
    const button = document.body.appendChild(document.createElement("button"))
    const kbd = button.appendChild(document.createElement("span"))
    button.append("Open")
    const trigger = instance.part("trigger", { id: "t", shortcut: "mod+k" })
    bind(trigger, button)
    bind(instance.part("shortcut", {}), kbd)
    expect(kbd.textContent).not.toBe("")
    expect(asleep(trigger)).toBe(true)
  })
})
