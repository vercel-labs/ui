// @vitest-environment jsdom
import { Component, inject, NgZone } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "../src/accordion"
import { Tabs, TabsList, TabsTab } from "../src/tabs"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Tabs,
    TabsList,
    TabsTab,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
  ],
  template: `
    <div uiTabs defaultValue="a" (valueChange)="heard.push(inside)">
      <div uiTabsList>
        <button uiTabsTab value="a">A</button>
        <button uiTabsTab value="b" id="tab">B</button>
      </div>
    </div>
    <div uiAccordion>
      <div uiAccordionItem value="a" (beforeOpenChange)="heard.push(inside)">
        <h3 uiAccordionHeader>
          <button uiAccordionTrigger id="trigger">A</button>
        </h3>
      </div>
    </div>
  `,
})
class Page {
  readonly heard: boolean[] = []
  inside = false

  constructor() {
    const zone = inject(NgZone)
    const run = zone.run.bind(zone)
    zone.run = <Result>(callback: () => Result) => {
      const before = this.inside
      this.inside = true
      try {
        return run(callback)
      } finally {
        this.inside = before
      }
    }
  }
}

describe("zone", () => {
  test("a root's output and a part's emit inside Angular's zone", async () => {
    const { host, instance } = await mount(Page)
    host.querySelector<HTMLElement>("#tab")!.click()
    host.querySelector<HTMLElement>("#trigger")!.click()
    expect(instance.heard).toEqual([true, true])
  })
})
