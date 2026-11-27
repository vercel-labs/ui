// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { expect, test } from "vitest"
import { Accordion } from "../src/accordion"
import { CheckboxGroup } from "../src/checkbox"
import { Menu, MenuRadioGroup } from "../src/menu"
import { RadioGroup } from "../src/radio"
import { SegmentedControl } from "../src/segmented-control"
import { Tabs, TabsList, TabsTab } from "../src/tabs"
import { ToggleGroup } from "../src/toggle"
import { mount } from "./mount"

type Plan = "free" | "pro"

@Component({
  selector: "test-root",
  imports: [
    Accordion,
    CheckboxGroup,
    Menu,
    MenuRadioGroup,
    RadioGroup,
    SegmentedControl,
    Tabs,
    TabsList,
    TabsTab,
    ToggleGroup,
  ],
  template: `
    <div uiTabs [value]="one()" (valueChange)="one.set($event)">
      <div uiTabsList>
        <button uiTabsTab value="free">Free</button>
        <button uiTabsTab value="pro" id="pro">Pro</button>
      </div>
    </div>
    <div uiRadioGroup [value]="one()" (valueChange)="one.set($event)"></div>
    <div
      uiSegmentedControl
      [value]="one()"
      (valueChange)="one.set($event)"
    ></div>
    <div uiAccordion [value]="many()" (valueChange)="many.set($event)"></div>
    <div
      uiCheckboxGroup
      [value]="many()"
      (valueChange)="many.set($event)"
    ></div>
    <div uiToggleGroup [value]="many()" (valueChange)="many.set($event)"></div>
    <ng-container uiMenu>
      <div
        uiMenuRadioGroup
        [value]="one()"
        (beforeValueChange)="one.set($event.value)"
      ></div>
    </ng-container>
  `,
})
class Page {
  readonly one = signal<Plan | null>("free")
  readonly many = signal<Plan[]>(["free"])
}

// The template is the test: it compiles only while each root's events carry
// the values its `value` was given.
test("a value root's events carry its own values", async () => {
  const { host, instance, settle } = await mount(Page)
  host.querySelector<HTMLElement>("#pro")!.click()
  await settle()
  expect(instance.one()).toBe("pro")
})
