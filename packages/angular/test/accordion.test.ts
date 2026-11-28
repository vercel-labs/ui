// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  type AccordionItemOpenChange,
  AccordionPanel,
  AccordionTrigger,
} from "../src/accordion"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionPanel,
  ],
  template: `
    <div uiAccordion [(value)]="value" [multiple]="multiple()">
      @for (name of ["a", "b"]; track name) {
        <div
          uiAccordionItem
          [value]="name"
          #item="uiAccordionItem"
          (beforeOpenChange)="before(name, $event)"
        >
          <h3 uiAccordionHeader>
            <button uiAccordionTrigger>
              {{ name }}{{ item.state().open ? " open" : "" }}
            </button>
          </h3>
          <div *uiAccordionPanel class="panel">Panel {{ name }}</div>
        </div>
      }
    </div>
  `,
})
class Page {
  readonly value = signal<string[]>([])
  readonly multiple = signal(false)
  readonly asked: string[] = []
  locked = ""

  before(name: string, change: AccordionItemOpenChange) {
    this.asked.push(`${name}:${change.value}`)
    if (this.locked === name) {
      change.cancel()
    }
  }
}

const trigger = (host: HTMLElement, name: string) =>
  [...host.querySelectorAll("button")].find((el) =>
    el.textContent?.trim().startsWith(name)
  )!
const panels = (host: HTMLElement) =>
  [...host.querySelectorAll(".panel")].map((el) => el.textContent?.trim())

describe("accordion", () => {
  test("a press opens its item and closes the one that was open", async () => {
    const { host, instance, settle } = await mount(Page)
    trigger(host, "a").click()
    await settle()
    expect(instance.value()).toEqual(["a"])
    expect(panels(host)).toEqual(["Panel a"])
    trigger(host, "b").click()
    await settle()
    expect(instance.value()).toEqual(["b"])
    expect(panels(host)).toEqual(["Panel b"])
    expect(trigger(host, "a").getAttribute("aria-expanded")).toBe("false")
  })

  test("multiple keeps several items open", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.multiple.set(true)
    await settle()
    trigger(host, "a").click()
    await settle()
    trigger(host, "b").click()
    await settle()
    expect(instance.value()).toEqual(["a", "b"])
    expect(panels(host)).toEqual(["Panel a", "Panel b"])
    expect(trigger(host, "a").getAttribute("aria-controls")).toBe(
      host.querySelector(".panel")?.id
    )
  })

  test("an item's state() updates a template that reads it", async () => {
    const { host, settle } = await mount(Page)
    trigger(host, "a").click()
    await settle()
    expect(trigger(host, "a").textContent?.trim()).toBe("a open")
  })

  test("cancel() in an item's (beforeOpenChange) keeps it closed", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.locked = "a"
    trigger(host, "a").click()
    await settle()
    expect(instance.asked).toEqual(["a:true"])
    expect(instance.value()).toEqual([])
    expect(panels(host)).toEqual([])
  })

  test("setting the bound value opens its item", async () => {
    const { host, instance, settle } = await mount(Page)
    instance.value.set(["b"])
    await settle()
    expect(trigger(host, "b").getAttribute("aria-expanded")).toBe("true")
    expect(panels(host)).toEqual(["Panel b"])
  })
})
