// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import type { ListData } from "@ui-sdk/core/listbox"
import { describe, expect, test } from "vitest"
import {
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIndicator,
  ListboxItems,
  ListboxSeparator,
} from "../src/listbox"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Listbox,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxItemIndicator,
    ListboxSeparator,
  ],
  template: `
    <form id="form">
      <div
        uiListbox
        id="list"
        aria-label="Fruit"
        name="fruit"
        [multiple]="multiple()"
        [(value)]="value"
      >
        <div uiListboxGroup id="group">
          <div uiListboxGroupLabel id="group-label">Common</div>
          <div uiListboxItem id="apple" value="apple">
            Apple <span *uiListboxItemIndicator id="apple-check">✓</span>
          </div>
          <div uiListboxItem id="banana" value="banana">Banana</div>
        </div>
        <div uiListboxSeparator id="separator"></div>
        <div uiListboxItem id="cherry" value="cherry" disabled>Cherry</div>
      </div>
    </form>
  `,
})
class Parts {
  readonly multiple = signal(false)
  readonly value = signal<unknown>(null)
}

@Component({
  selector: "test-root",
  imports: [Listbox, ListboxItems],
  template: `
    <div uiListbox aria-label="Plan" [items]="items" defaultValue="pro">
      <div uiListboxItems></div>
    </div>
  `,
})
class Data {
  readonly items: ListData = [
    "free",
    { value: "pro", label: "Pro" },
    { type: "separator" },
    {
      type: "group",
      label: "Teams",
      items: [{ value: "team", label: "Team", disabled: true }],
    },
  ]
}

const byId = (id: string) => document.getElementById(id)!
const submitted = () =>
  new FormData(byId("form") as HTMLFormElement).getAll("fruit")

describe("listbox", () => {
  test("selects an item and submits it", async () => {
    const { instance, settle } = await mount(Parts)
    const list = byId("list")
    expect(list.getAttribute("role")).toBe("listbox")
    expect(byId("group").getAttribute("aria-labelledby")).toBe("group-label")
    expect(byId("separator").getAttribute("aria-hidden")).toBe("true")
    expect(byId("cherry").getAttribute("aria-disabled")).toBe("true")
    expect(document.getElementById("apple-check")).toBeNull()
    expect(submitted()).toEqual([""])

    byId("apple").click()
    await settle()
    expect(instance.value()).toBe("apple")
    expect(byId("apple").getAttribute("aria-selected")).toBe("true")
    expect(document.getElementById("apple-check")).not.toBeNull()
    expect(submitted()).toEqual(["apple"])
    const textarea = list.nextElementSibling!
    expect(textarea.localName).toBe("textarea")
    expect(textarea.hasAttribute("value")).toBe(false)
    expect(textarea.textContent).toBe("apple")

    byId("cherry").click()
    await settle()
    expect(instance.value()).toBe("apple")
  })

  test("with multiple, each value submits through its own input", async () => {
    const { instance, settle } = await mount(Parts)
    instance.multiple.set(true)
    instance.value.set(["banana"])
    await settle()
    expect(byId("list").getAttribute("aria-multiselectable")).toBe("true")
    expect(submitted()).toEqual(["banana"])

    byId("apple").click()
    await settle()
    expect(instance.value()).toEqual(["banana", "apple"])
    expect(submitted()).toEqual(["banana", "apple"])

    instance.value.set([])
    await settle()
    expect(submitted()).toEqual([])
    expect(document.querySelectorAll("input[type=hidden]")).toHaveLength(0)
  })

  test("renders items from data", async () => {
    await mount(Data)
    const options = [...document.querySelectorAll("[role=option]")]
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      "free",
      "Pro",
      "Team",
    ])
    expect(options[1].getAttribute("aria-selected")).toBe("true")
    expect(options[2].getAttribute("aria-disabled")).toBe("true")
    const group = document.querySelector("[role=group]")!
    const label = document.querySelector("[data-slot='listbox-group-label']")!
    expect(label.textContent).toBe("Teams")
    expect(group.getAttribute("aria-labelledby")).toBe(label.id)
    expect(group.contains(options[2])).toBe(true)
  })
})
