// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vitest"
import { collapsible } from "../src/components/collapsible/collapsible"
import { alertDialog, dialog } from "../src/components/dialog/dialog"
import { drawer } from "../src/components/drawer/drawer"
import { hoverCard } from "../src/components/hover-card/hover-card"
import { menu } from "../src/components/menu/menu"
import { popover } from "../src/components/popover/popover"
import { tooltip } from "../src/components/tooltip/tooltip"
import {
  attrs,
  bind,
  handlers,
  partState,
  present,
} from "../src/foundation/kernel/part"
import { afterBind, runBindWrites } from "../src/foundation/kernel/after-bind"
import type { Part } from "../src/foundation/kernel/primitive-types"
import { setPlatform } from "../src/foundation/platform/platform"

Element.prototype.getAnimations ??= () => []

afterEach(() => {
  document.body.replaceChildren()
  setPlatform("other")
})

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

  test("a tooltip's shortcut that arrives after its trigger binds takes the platform's names", async () => {
    const instance = tooltip({ id: "tip" })
    setPlatform("apple")
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Save"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    await Promise.resolve()
    expect(instance.get().apple).toBe(false)

    instance.setOptions({ id: "tip", shortcut: "mod+s" })
    await Promise.resolve()
    expect(attrs(trigger)["aria-keyshortcuts"]).toBe("Meta+S")
    expect(asleep(trigger)).toBe(true)
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

  test("hovering or focusing a closed dialog, alert-dialog, drawer, click popover or standalone menu keeps it asleep", () => {
    const stayAsleep = (trigger: Part, destroy: () => void) => {
      const el = document.body.appendChild(document.createElement("button"))
      el.textContent = "Open"
      bind(trigger, el)
      el.dispatchEvent(new Event("pointerenter"))
      el.dispatchEvent(new Event("pointermove"))
      el.dispatchEvent(new Event("pointerleave"))
      el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }))
      el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }))
      expect(asleep(trigger)).toBe(true)
      destroy()
    }
    const dlg = dialog({ id: "hover-dlg" })
    stayAsleep(dlg.part("trigger", { id: "t" }), dlg.destroy)
    const alert = alertDialog({ id: "hover-alert" })
    stayAsleep(alert.part("trigger", { id: "t" }), alert.destroy)
    const drw = drawer({ id: "hover-drw" })
    stayAsleep(drw.part("trigger", { id: "t" }), drw.destroy)
    const pop = popover({ id: "hover-pop" })
    stayAsleep(pop.part("trigger", { id: "t" }), pop.destroy)
    const mn = menu({ id: "hover-menu" })
    stayAsleep(mn.part("trigger", { id: "t" }), mn.destroy)
  })

  test("popover with openOnHover enabled after mount wakes and attaches hover listeners", () => {
    const instance = popover({ id: "late-hover" })
    const el = document.body.appendChild(document.createElement("button"))
    el.textContent = "Info"
    const trigger = instance.part("trigger", { id: "t" })
    bind(trigger, el)
    expect(asleep(trigger)).toBe(true)

    instance.setOptions({ id: "late-hover", openOnHover: true, delay: 0 })
    expect(asleep(trigger)).toBe(false)
    el.dispatchEvent(new Event("pointerenter"))
    expect(instance.get().open).toBe(true)
    instance.destroy()
  })

  test("closed collapsible stays asleep until pressed or its panel mounts", () => {
    const instance = collapsible({ id: "col" })
    const rootEl = document.body.appendChild(document.createElement("div"))
    const triggerEl = rootEl.appendChild(document.createElement("button"))
    triggerEl.textContent = "Toggle"
    const root = instance.part("root")
    const trigger = instance.part("trigger")
    const panel = instance.part("panel")
    bind(root, rootEl)
    bind(trigger, triggerEl)
    expect(attrs(trigger)["aria-expanded"]).toBe("false")
    expect(present(panel)).toBe(false)
    expect(asleep(trigger)).toBe(true)

    handlers(trigger).click!(new MouseEvent("click"))
    expect(asleep(trigger)).toBe(false)
    expect(instance.get().open).toBe(true)
    instance.destroy()

    const kept = collapsible({ id: "col-kept" })
    const keptTrigger = kept.part("trigger")
    const keptPanel = kept.part("panel", { keepMounted: true })
    expect(present(keptPanel)).toBe(true)
    expect(asleep(keptTrigger)).toBe(true)
    const panelEl = document.body.appendChild(document.createElement("div"))
    bind(keptPanel, panelEl)
    expect(asleep(keptTrigger)).toBe(false)
    expect(kept.get().panel).toBe(true)
    kept.destroy()
  })

  test("canceled hover events skip popover and submenu hover handlers", () => {
    const pop = popover({ id: "cancel-pop", openOnHover: true, delay: 0 })
    const popEl = document.body.appendChild(document.createElement("button"))
    popEl.textContent = "Info"
    const popTrigger = pop.part("trigger", { id: "t" })
    bind(popTrigger, popEl, { by: "framework", attaches: "all" })
    const enter = new Event("pointerenter", { cancelable: true })
    enter.preventDefault()
    handlers(popTrigger).pointerenter!(enter)
    expect(pop.get().open).toBe(false)
    pop.destroy()

    const parent = menu({ id: "cancel-parent", defaultOpen: true })
    const sub = menu({ id: "cancel-sub", parent: parent.api })
    const subEl = document.body.appendChild(document.createElement("div"))
    subEl.textContent = "More"
    const subTrigger = sub.part("trigger", { id: "st" })
    bind(subTrigger, subEl, { by: "framework", attaches: "all" })
    const move = new Event("pointermove", { cancelable: true })
    move.preventDefault()
    handlers(subTrigger).pointermove!(move)
    expect(parent.get().highlighted).toBeNull()
    sub.destroy()
    parent.destroy()
  })

  test("a throwing afterBind write does not strand later writes", async () => {
    const ran: string[] = []
    afterBind(() => {
      throw new Error("boom")
    })
    afterBind(() => {
      ran.push("second")
    })
    expect(() => runBindWrites()).toThrow("boom")
    await Promise.resolve()
    expect(ran).toEqual(["second"])
  })
})
