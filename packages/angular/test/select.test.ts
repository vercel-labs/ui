// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import {
  createSelectController,
  type ListData,
  Select,
  SelectContent,
  SelectEmpty,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItems,
  SelectItemText,
  SelectList,
  SelectSelectAll,
  SelectTrigger,
  SelectValue,
} from "../src/select"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
  ],
  template: `
    <form id="form">
      <div uiField name="role">
        <label uiFieldLabel id="label">Role</label>
        <ng-container uiSelect placeholder="Select a role" [(value)]="value">
          <button uiSelectTrigger id="trigger">
            <span uiSelectValue id="value"></span>
          </button>
          <div *uiSelectContent="{ side: 'bottom' }" id="content">
            <div uiSelectItem id="viewer" value="viewer">
              Viewer <span *uiSelectItemIndicator id="viewer-check">✓</span>
            </div>
            <div uiSelectItem id="editor" value="editor" label="Editor">
              <b>Editor</b>
            </div>
          </div>
        </ng-container>
      </div>
    </form>
  `,
})
class Parts {
  readonly value = signal<string | null>(null)
}

@Component({
  selector: "test-root",
  imports: [
    Select,
    SelectContent,
    SelectEmpty,
    SelectInput,
    SelectItem,
    SelectItems,
    SelectItemText,
    SelectList,
    SelectSelectAll,
    SelectTrigger,
    SelectValue,
  ],
  template: `
    <button uiSelectTrigger id="outside" [controller]="controller">
      <span uiSelectValue id="outside-value"></span>
    </button>
    <ng-container
      uiSelect
      multiple
      aria-label="Fruit"
      [items]="items"
      [controller]="controller"
      [(value)]="value"
      [(open)]="open"
    >
      <div *uiSelectContent id="content">
        <input uiSelectInput id="search" aria-label="Search" />
        <div uiSelectList id="list">
          <div *uiSelectSelectAll id="all">All</div>
          <div uiSelectItems></div>
          <div uiSelectItem id="kiwi" value="kiwi">
            <span uiSelectItemText id="kiwi-text">Kiwi</span>
          </div>
        </div>
        <div uiSelectEmpty id="empty">No fruit found</div>
      </div>
    </ng-container>
  `,
})
class Data {
  readonly controller = createSelectController<string, true>()
  readonly items: ListData = [
    "Apple",
    { type: "group", label: "Yellow", items: ["Banana"] },
  ]
  readonly value = signal<string[]>([])
  readonly open = signal(false)
}

const byId = (id: string) => document.getElementById(id)!
const type = (input: HTMLInputElement, value: string) => {
  input.value = value
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
}

describe("select", () => {
  test("opens from its trigger, selects an item and submits it", async () => {
    const { instance, settle } = await mount(Parts)
    const trigger = byId("trigger")
    expect(trigger.getAttribute("role")).toBe("combobox")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    expect(trigger.getAttribute("aria-labelledby")).toContain("label")
    expect(byId("value").textContent).toBe("Select a role")
    expect(document.getElementById("content")).toBeNull()

    trigger.click()
    await settle()
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(byId("content").getAttribute("data-side")).toBe("bottom")
    expect(byId("viewer").getAttribute("role")).toBe("option")

    byId("editor").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toBe("editor")
    expect(byId("value").textContent).toBe("Editor")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    const form = new FormData(byId("form") as HTMLFormElement)
    expect(form.get("role")).toBe("editor")
  })

  test("a controlled value selects its item and shows its label", async () => {
    const { instance, settle } = await mount(Parts)
    instance.value.set("viewer")
    await settle()
    byId("trigger").click()
    await settle()
    expect(byId("viewer").getAttribute("aria-selected")).toBe("true")
    expect(document.getElementById("viewer-check")).not.toBeNull()
    expect(byId("value").textContent).toBe("Viewer")
  })

  test("renders data items, filters them and marks what matched", async () => {
    const { instance, settle } = await mount(Data)
    expect(byId("outside").getAttribute("aria-haspopup")).toBe("listbox")
    instance.open.set(true)
    await settle()
    const labels = () =>
      [
        ...document.querySelectorAll("#list [role=option]:not(#all, [hidden])"),
      ].map((option) => option.textContent?.trim())
    expect(byId("all").getAttribute("aria-selected")).toBe("false")
    expect(labels()).toEqual(["Apple", "Banana", "Kiwi"])
    expect(byId("empty").textContent).toBe("")

    type(byId("search") as HTMLInputElement, "ki")
    await settle()
    expect(labels()).toEqual(["Kiwi"])
    expect(byId("kiwi-text").innerHTML).toBe("<mark>Ki</mark>wi")

    type(byId("search") as HTMLInputElement, "")
    await settle()
    expect(byId("kiwi-text").innerHTML).toBe("Kiwi")
    byId("all").click()
    await settle()
    expect(instance.value()).toEqual(["Apple", "Banana"])
    expect(byId("outside-value").textContent).toContain("Apple")
  })
})
