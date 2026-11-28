// @vitest-environment node
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Tabs, TabsList, TabsPanel, TabsTab } from "../src/tabs"
import { render, tagWith } from "./render"

@Component({
  selector: "test-root",
  imports: [Tabs, TabsList, TabsTab, TabsPanel],
  template: `
    <div uiTabs defaultValue="b">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="a">A</button>
        <button uiTabsTab value="b">B</button>
      </div>
      <div uiTabsPanel value="a">Panel A</div>
      <div uiTabsPanel value="b">Panel B</div>
    </div>
  `,
})
class Uncontrolled {}

@Component({
  selector: "test-root",
  imports: [Tabs, TabsList, TabsTab, TabsPanel],
  template: `
    <div uiTabs [(value)]="tab">
      <div uiTabsList aria-label="Settings">
        <button uiTabsTab value="a">A</button>
        <button uiTabsTab value="b">B</button>
      </div>
      <div *uiTabsPanel="'a'">Panel A</div>
      <div *uiTabsPanel="'b'">Panel B</div>
    </div>
  `,
})
class Controlled {
  readonly tab = signal<string | null>("b")
}

// Runs with no DOM globals: a read of window or document while rendering throws.
describe("server rendering tabs", () => {
  test("renders the selected tab as the tab stop and hides the other panel", async () => {
    const html = await render(Uncontrolled)
    expect(typeof window).toBe("undefined")
    expect(html).toContain('role="tablist"')
    expect(tagWith(html, "B")).toContain('aria-selected="true"')
    expect(tagWith(html, "B")).toContain('tabindex="0"')
    expect(tagWith(html, "A")).toContain('tabindex="-1"')
    expect(tagWith(html, "Panel B")).toContain('role="tabpanel"')
    expect(tagWith(html, "Panel B")).not.toContain("hidden")
    expect(tagWith(html, "Panel A")).toContain('hidden=""')
  })

  test("points the selected panel at its tab", async () => {
    const html = await render(Uncontrolled)
    const tab = tagWith(html, "B").match(/ id="([^"]+)"/)?.[1]
    expect(tab).toBeTruthy()
    expect(tagWith(html, "Panel B")).toContain(`aria-labelledby="${tab}"`)
  })

  test("renders only the selected panel in the star form, from a bound value", async () => {
    const html = await render(Controlled)
    expect(tagWith(html, "B")).toContain('aria-selected="true"')
    expect(tagWith(html, "Panel B")).toContain('role="tabpanel"')
    expect(html).not.toContain("Panel A")
  })
})
