// @vitest-environment jsdom
import { Component, EventEmitter, NgZone } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "../src/accordion"
import { Tabs, TabsList, TabsTab } from "../src/tabs"
import { mount } from "./mount"

let inside = false

// Angular's own zone needs Zone.js. This one is an `NgZone` that only says
// when something runs inside it.
const zone: NgZone = Object.assign(Object.create(NgZone.prototype), {
  hasPendingMicrotasks: false,
  hasPendingMacrotasks: false,
  isStable: true,
  onUnstable: new EventEmitter(),
  onMicrotaskEmpty: new EventEmitter(),
  onStable: new EventEmitter(),
  onError: new EventEmitter(),
  run<Result>(callback: () => Result) {
    const before = inside
    inside = true
    try {
      return callback()
    } finally {
      inside = before
    }
  },
  runGuarded: <Result>(callback: () => Result) => callback(),
  runOutsideAngular: <Result>(callback: () => Result) => callback(),
  runTask: <Result>(callback: () => Result) => callback(),
})

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
    <div uiTabs defaultValue="a" (valueChange)="heard.push(inside())">
      <div uiTabsList>
        <button uiTabsTab value="a">A</button>
        <button uiTabsTab value="b" id="tab">B</button>
      </div>
    </div>
    <div uiAccordion>
      <div uiAccordionItem value="a" (beforeOpenChange)="heard.push(inside())">
        <h3 uiAccordionHeader>
          <button uiAccordionTrigger id="trigger">A</button>
        </h3>
      </div>
    </div>
  `,
})
class Page {
  readonly heard: boolean[] = []
  readonly inside = () => inside
}

describe("zone", () => {
  test("with Zone.js, a root's output and a part's emit inside Angular's zone", async () => {
    const { host, instance } = await mount(Page, [
      { provide: NgZone, useValue: zone },
    ])
    host.querySelector<HTMLElement>("#tab")!.click()
    host.querySelector<HTMLElement>("#trigger")!.click()
    expect(instance.heard).toEqual([true, true])
  })
})
