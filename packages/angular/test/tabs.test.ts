// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  type TabsValueChange,
} from "../src/tabs"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Tabs, TabsList, TabsTab, TabsPanel],
  template: `
    <div uiTabs defaultValue="a">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="a" #first="uiTabsTab">
          A{{ first.state().selected ? " on" : "" }}
        </button>
        <button uiTabsTab value="b">B</button>
        <button uiTabsTab value="c" disabled>C</button>
      </div>
      <div uiTabsPanel value="a">Panel A</div>
      <div uiTabsPanel value="b">Panel B</div>
      <div uiTabsPanel value="c">Panel C</div>
    </div>
  `,
})
class Uncontrolled {}

@Component({
  selector: "test-root",
  imports: [Tabs, TabsList, TabsTab, TabsPanel],
  template: `
    <div uiTabs [(value)]="tab" (beforeValueChange)="before($event)">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="a">A</button>
        <button uiTabsTab value="b">B</button>
      </div>
      <div *uiTabsPanel="'a'" class="panel">Panel A</div>
      <div *uiTabsPanel="'b'" class="panel">Panel B</div>
    </div>
  `,
})
class Controlled {
  readonly tab = signal<string | null>("a")
  readonly changes: string[] = []
  locked = false

  before(change: TabsValueChange) {
    this.changes.push(`${change.reason}:${change.value}`)
    if (this.locked) {
      change.cancel()
    }
  }
}

const tab = (host: HTMLElement, name: string) =>
  [...host.querySelectorAll<HTMLElement>('[role="tab"]')].find((el) =>
    el.textContent?.trim().startsWith(name)
  )!
const panels = (host: HTMLElement) =>
  [...host.querySelectorAll<HTMLElement>('[role="tabpanel"]')]
    .filter((el) => !el.hidden)
    .map((el) => el.textContent?.trim())

describe("tabs", () => {
  test("a click selects the tab and shows its panel before change detection runs", async () => {
    const { host } = await mount(Uncontrolled)
    expect(panels(host)).toEqual(["Panel A"])
    tab(host, "B").click()
    expect(tab(host, "B").getAttribute("aria-selected")).toBe("true")
    expect(tab(host, "A").getAttribute("aria-selected")).toBe("false")
    expect(panels(host)).toEqual(["Panel B"])
  })

  test("a disabled tab ignores a click", async () => {
    const { host } = await mount(Uncontrolled)
    tab(host, "C").click()
    expect(tab(host, "C").getAttribute("aria-disabled")).toBe("true")
    expect(panels(host)).toEqual(["Panel A"])
  })

  test("state() updates a template that reads it", async () => {
    const { host, settle } = await mount(Uncontrolled)
    expect(tab(host, "A").textContent?.trim()).toBe("A on")
    tab(host, "B").click()
    await settle()
    expect(tab(host, "A").textContent?.trim()).toBe("A")
  })

  test("a bound value follows a click and reports why it changed", async () => {
    const { host, instance, settle } = await mount(Controlled)
    tab(host, "B").click()
    await settle()
    expect(instance.tab()).toBe("b")
    expect(instance.changes).toEqual(["item-press:b"])
    expect(tab(host, "B").getAttribute("aria-selected")).toBe("true")
  })

  test("a bound value reaches the tabs in the task that changed it", async () => {
    const { host } = await mount(Controlled)
    tab(host, "B").click()
    // A browser runs microtasks between two events, and no render.
    await Promise.resolve()
    expect(tab(host, "B").getAttribute("aria-selected")).toBe("true")
  })

  test("setting the bound value selects its tab", async () => {
    const { host, instance, settle } = await mount(Controlled)
    instance.tab.set("b")
    await settle()
    expect(tab(host, "B").getAttribute("aria-selected")).toBe("true")
    expect(instance.changes).toEqual([])
  })

  test("cancel() keeps the tab and the bound value", async () => {
    const { host, instance, settle } = await mount(Controlled)
    instance.locked = true
    tab(host, "B").click()
    await settle()
    expect(instance.tab()).toBe("a")
    expect(tab(host, "A").getAttribute("aria-selected")).toBe("true")
    expect(instance.changes).toEqual(["item-press:b"])
  })

  test("the star form keeps only the selected panel in the page", async () => {
    const { host, settle } = await mount(Controlled)
    const shown = () =>
      [...host.querySelectorAll(".panel")].map((el) => el.textContent?.trim())
    expect(shown()).toEqual(["Panel A"])
    tab(host, "B").click()
    await settle()
    expect(shown()).toEqual(["Panel B"])
    expect(host.querySelector(".panel")?.getAttribute("role")).toBe("tabpanel")
  })
})
