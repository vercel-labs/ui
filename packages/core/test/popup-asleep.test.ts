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
import type { Part } from "../src/foundation/kernel/primitive-types"

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

  test("a dialog or popover that may present as a sheet starts awake, as a sheet", () => {
    const sheetDialog = dialog({ id: "sheet-dlg", presentation: "sheet" })
    const sheetPopover = popover({ id: "sheet-pop", presentation: "sheet" })
    expect(asleep(sheetDialog.part("trigger", { id: "t" }))).toBe(false)
    expect(asleep(sheetPopover.part("trigger", { id: "t" }))).toBe(false)
    expect(sheetDialog.get().presentation).toBe("sheet")
    expect(sheetPopover.get().presentation).toBe("sheet")
  })

  test("parts render through a wake that changes state", () => {
    const rendersOnChange = (
      subscribe: (listener: () => void) => unknown,
      parts: Part[]
    ) => {
      const shown: boolean[] = []
      subscribe(() => {
        for (const part of parts) {
          shown.push(present(part))
          if (shown.at(-1)) {
            attrs(part)
          }
        }
      })
      return shown
    }

    const lateDialog = dialog({ id: "late-dlg" })
    const dialogTrigger = lateDialog.part("trigger", { id: "t" })
    const dialogShown = rendersOnChange(lateDialog.subscribe, [
      dialogTrigger,
      lateDialog.part("backdrop"),
      lateDialog.part("content"),
    ])
    lateDialog.setOptions({ id: "late-dlg", presentation: "sheet" })
    expect(lateDialog.get().presentation).toBe("sheet")
    expect(dialogShown.length).toBeGreaterThan(0)
    expect(asleep(dialogTrigger)).toBe(false)

    const latePopover = popover({ id: "late-pop" })
    const popoverTrigger = latePopover.part("trigger", { id: "t" })
    const popoverShown = rendersOnChange(latePopover.subscribe, [
      popoverTrigger,
      latePopover.part("content"),
    ])
    latePopover.setOptions({ id: "late-pop", presentation: "sheet" })
    expect(latePopover.get().presentation).toBe("sheet")
    expect(popoverShown.length).toBeGreaterThan(0)
    expect(asleep(popoverTrigger)).toBe(false)
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
