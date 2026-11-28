// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "../src/collapsible"
import { render, tagWith } from "./render"

const imports = [Collapsible, CollapsibleTrigger, CollapsiblePanel]

@Component({
  selector: "test-root",
  imports,
  template: `
    <div uiCollapsible defaultOpen>
      <button uiCollapsibleTrigger>Details</button>
      <div uiCollapsiblePanel>Panel</div>
    </div>
  `,
})
class Open {}

@Component({
  selector: "test-root",
  imports,
  template: `
    <div uiCollapsible>
      <button uiCollapsibleTrigger>Details</button>
      <div uiCollapsiblePanel>Kept</div>
      <div *uiCollapsiblePanel>Lazy</div>
    </div>
  `,
})
class Closed {}

@Component({
  selector: "test-root",
  imports,
  template: `
    <div uiCollapsible>
      <button uiCollapsibleTrigger>Details</button>
      <div uiCollapsiblePanel hiddenUntilFound>Panel</div>
    </div>
  `,
})
class Findable {}

// Runs with no DOM globals: a read of window or document while rendering throws.
describe("server rendering a collapsible", () => {
  test("renders an open panel with its content", async () => {
    const html = await render(Open)
    expect(typeof window).toBe("undefined")
    expect(tagWith(html, "Details")).toContain('aria-expanded="true"')
    expect(tagWith(html, "Panel")).not.toContain("hidden")
  })

  test("hides a closed panel, and leaves it out in the star form", async () => {
    const html = await render(Closed)
    expect(tagWith(html, "Details")).toContain('aria-expanded="false"')
    expect(tagWith(html, "Kept")).toContain('hidden=""')
    expect(html).not.toContain("Lazy")
  })

  test("renders a findable panel as hidden until found, so find in page works before hydration", async () => {
    const html = await render(Findable)
    expect(tagWith(html, "Panel")).toContain('hidden="until-found"')
  })
})
