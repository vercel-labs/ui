// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Toggle, ToggleGroup } from "../src/toggle"
import { Toolbar, ToolbarButton, ToolbarGroup } from "../src/toolbar"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Toggle, ToggleGroup, Toolbar, ToolbarButton, ToolbarGroup],
  template: `
    <button uiToggle id="bold" [(pressed)]="bold">Bold</button>
    <button uiToggle id="kept" (click)="$event.preventDefault()">Kept</button>
    <button uiToggle id="fixed" [pressed]="false">Fixed</button>
    <div uiToggleGroup id="align" [(value)]="align">
      <button uiToggle value="left">Left</button>
      <button uiToggle value="right">Right</button>
    </div>
    <div uiToolbar id="bar">
      <button uiToolbarButton id="undo">Undo</button>
      <div uiToolbarGroup [disabled]="locked()">
        <button uiToggle id="italic">Italic</button>
        <button uiToolbarButton id="redo">Redo</button>
      </div>
    </div>
  `,
})
class Page {
  readonly bold = signal(false)
  readonly align = signal<string[]>([])
  readonly locked = signal(false)
}

const el = (host: HTMLElement, selector: string) =>
  host.querySelector<HTMLElement>(selector)!
const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true })
  )

@Component({
  selector: "test-root",
  imports: [Toggle],
  template: `
    <button
      uiToggle
      [defaultPressed]="on"
      #toggle="uiToggle"
      [class.active]="toggle.state().pressed"
    >
      Bold
    </button>
  `,
})
class BoundDefault {
  readonly on = true
}

describe("toggle", () => {
  test("a bound default applies when a class binding reads the state first", async () => {
    const { host, settle } = await mount(BoundDefault)
    const button = host.querySelector("button")!
    expect(button.getAttribute("aria-pressed")).toBe("true")
    expect(button.classList.contains("active")).toBe(true)
    button.click()
    await settle()
    expect(button.getAttribute("aria-pressed")).toBe("false")
    expect(button.classList.contains("active")).toBe(false)
  })

  test("a press toggles it and updates the bound value", async () => {
    const { host, instance, settle } = await mount(Page)
    expect(el(host, "#bold").getAttribute("aria-pressed")).toBe("false")
    el(host, "#bold").click()
    await settle()
    expect(instance.bold()).toBe(true)
    expect(el(host, "#bold").getAttribute("aria-pressed")).toBe("true")
  })

  test("an author's click handler runs first and can skip the toggle's", async () => {
    const { host, settle } = await mount(Page)
    el(host, "#kept").click()
    await settle()
    expect(el(host, "#kept").getAttribute("aria-pressed")).toBe("false")
  })

  test("a one-way bound value stays as the parent says", async () => {
    const { host, settle } = await mount(Page)
    el(host, "#fixed").click()
    await settle()
    expect(el(host, "#fixed").getAttribute("aria-pressed")).toBe("false")
  })

  test("a toggle in a group takes its pressed state from the group", async () => {
    const { host, instance, settle } = await mount(Page)
    const [left, right] = host.querySelectorAll<HTMLElement>("#align button")
    left!.click()
    await settle()
    expect(instance.align()).toEqual(["left"])
    right!.click()
    await settle()
    expect(instance.align()).toEqual(["right"])
    expect(left!.getAttribute("aria-pressed")).toBe("false")
    expect(right!.getAttribute("aria-pressed")).toBe("true")
  })

  test("a toggle in a toolbar joins its arrow keys and one tab stop", async () => {
    const { host } = await mount(Page)
    const stops = [...host.querySelectorAll<HTMLElement>("#bar button")].map(
      (button) => button.getAttribute("tabindex")
    )
    expect(stops).toEqual(["0", "-1", "-1"])
    el(host, "#undo").focus()
    key(el(host, "#undo"), "ArrowRight")
    expect(document.activeElement?.id).toBe("italic")
    key(el(host, "#italic"), "ArrowRight")
    expect(document.activeElement?.id).toBe("redo")
  })

  test("a disabled toolbar group disables the toggle and buttons in it", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.locked.set(true)
    await settle()
    expect(el(host, "#italic").getAttribute("aria-disabled")).toBe("true")
    expect(el(host, "#redo").getAttribute("aria-disabled")).toBe("true")
    expect(el(host, "#undo").hasAttribute("aria-disabled")).toBe(false)
  })
})
