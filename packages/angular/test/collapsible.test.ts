// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Collapsible,
  type CollapsibleOpenChange,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "../src/collapsible"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Collapsible, CollapsibleTrigger, CollapsiblePanel],
  template: `
    <div
      uiCollapsible
      [(open)]="open"
      (beforeOpenChange)="before($event)"
      (openChangeComplete)="completed.push($event)"
    >
      <button uiCollapsibleTrigger>Details</button>
      <div uiCollapsiblePanel id="kept">Kept</div>
      <div *uiCollapsiblePanel id="lazy">Lazy</div>
    </div>
  `,
})
class Page {
  readonly open = signal(false)
  readonly reasons: string[] = []
  readonly completed: boolean[] = []
  locked = false

  before(change: CollapsibleOpenChange) {
    this.reasons.push(`${change.reason}:${change.value}`)
    if (this.locked) {
      change.cancel()
    }
  }
}

const trigger = (host: HTMLElement) => host.querySelector("button")!

describe("collapsible", () => {
  test("a press opens the panel and updates the bound value", async () => {
    const { host, instance, settle } = await mount(Page)
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(true)
    expect(host.querySelector("#lazy")).toBeNull()
    trigger(host).click()
    await settle()
    expect(instance.open()).toBe(true)
    expect(instance.reasons).toEqual(["trigger-press:true"])
    expect(trigger(host).getAttribute("aria-expanded")).toBe("true")
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(false)
    expect(host.querySelector("#lazy")?.textContent).toBe("Lazy")
  })

  test("the trigger points at the panel that is in the page", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.open.set(true)
    await settle()
    const controlled = trigger(host).getAttribute("aria-controls")
    expect(controlled).toBeTruthy()
    expect(host.querySelector(`[id="${controlled}"]`)).not.toBeNull()
  })

  test("cancel() keeps the panel closed", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.locked = true
    trigger(host).click()
    await settle()
    expect(instance.open()).toBe(false)
    expect(trigger(host).getAttribute("aria-expanded")).toBe("false")
    expect(host.querySelector("#lazy")).toBeNull()
  })

  test("setting the bound value closes the panel and removes the star form's element", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.open.set(true)
    await settle()
    instance.open.set(false)
    await settle()
    expect(trigger(host).getAttribute("aria-expanded")).toBe("false")
    expect(host.querySelector("#kept")?.hasAttribute("hidden")).toBe(true)
    expect(host.querySelector("#lazy")).toBeNull()
  })
})
