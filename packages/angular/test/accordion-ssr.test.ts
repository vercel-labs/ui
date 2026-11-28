// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "../src/accordion"
import { render, tagWith } from "./render"

const imports = [
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
]

@Component({
  selector: "test-root",
  imports,
  template: `
    <div uiAccordion [defaultValue]="['b']">
      @for (value of ["a", "b"]; track value) {
        <div uiAccordionItem [value]="value">
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>Trigger {{ value }}</button>
          </h3>
          <div uiAccordionPanel>Kept {{ value }}</div>
          <div *uiAccordionPanel>Lazy {{ value }}</div>
        </div>
      }
    </div>
  `,
})
class Page {}

@Component({
  selector: "test-root",
  imports,
  template: `
    <div uiAccordion hiddenUntilFound>
      <div uiAccordionItem>
        <h3 uiAccordionHeader>
          <button uiAccordionTrigger>Trigger</button>
        </h3>
        <div uiAccordionPanel>Panel</div>
      </div>
    </div>
  `,
})
class Findable {}

// Runs with no DOM globals: a read of window or document while rendering throws.
describe("server rendering an accordion", () => {
  test("renders open panels and hides closed ones", async () => {
    const html = await render(Page)
    expect(typeof window).toBe("undefined")
    expect(tagWith(html, "Trigger b")).toContain('aria-expanded="true"')
    expect(tagWith(html, "Trigger a")).toContain('aria-expanded="false"')
    expect(tagWith(html, "Kept b")).toContain('role="region"')
    expect(tagWith(html, "Kept b")).not.toContain("hidden")
    expect(tagWith(html, "Kept a")).toContain('hidden=""')
  })

  test("the star form leaves closed panels out", async () => {
    const html = await render(Page)
    expect(html).toContain("Lazy b")
    expect(html).not.toContain("Lazy a")
  })

  test("an item without a value gets a generated one its parts share", async () => {
    const html = await render(Findable)
    const id = tagWith(html, "Trigger").match(/ id="([^"]+)"/)
    expect(id?.[1]).toBeTruthy()
    expect(tagWith(html, "Panel")).toContain(`aria-labelledby="${id?.[1]}"`)
  })

  test("findable panels render hidden until found, so find in page works before hydration", async () => {
    const html = await render(Findable)
    expect(tagWith(html, "Panel")).toContain('hidden="until-found"')
  })
})
