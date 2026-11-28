// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Waterfall, type WaterfallData } from "../src/waterfall"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Waterfall],
  template: `
    <div
      uiWaterfall
      aria-label="Requests"
      [items]="items"
      [(expanded)]="expanded"
      [(value)]="value"
    ></div>
  `,
})
class Page {
  readonly items: WaterfallData = [
    {
      value: "page",
      label: "GET /",
      start: 0,
      duration: 1000,
      children: [
        { value: "api", label: "GET /api", start: 500, duration: 500 },
      ],
    },
  ]
  readonly expanded = signal<string[]>([])
  readonly value = signal<string | null>(null)
}

describe("waterfall", () => {
  test("the indicator expands a span into the bound value, and a press on a row selects it", async () => {
    const { host, instance, settle } = await mount(Page)
    const rows = host.querySelectorAll<HTMLElement>("[role=row]")
    expect(rows[1]!.hidden).toBe(true)
    host.querySelector<HTMLElement>("[data-slot=waterfall-indicator]")!.click()
    await settle()
    expect(instance.expanded()).toEqual(["page"])
    expect(rows[1]!.hidden).toBe(false)
    rows[1]!.click()
    await settle()
    expect(instance.value()).toBe("api")
    expect(rows[1]!.getAttribute("aria-selected")).toBe("true")
  })
})
