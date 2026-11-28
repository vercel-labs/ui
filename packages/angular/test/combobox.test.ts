// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxCreate,
  type ComboboxCreateRequest,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItems,
  ComboboxItemText,
  ComboboxList,
  ComboboxValue,
  type ListData,
} from "../src/combobox"
import { Field, FieldLabel } from "../src/field"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxItemText,
    ComboboxList,
    Field,
    FieldLabel,
  ],
  template: `
    <form id="form">
      <div uiField name="fruit">
        <label uiFieldLabel id="label">Fruit</label>
        <ng-container uiCombobox [(value)]="value" [(query)]="query">
          <input uiComboboxInput id="input" />
          <div *uiComboboxContent="{ side: 'bottom' }" id="content">
            <div uiComboboxList id="list">
              <div uiComboboxItem id="apple" value="apple" label="Apple">
                <span uiComboboxItemText id="apple-text"></span>
                <span *uiComboboxItemIndicator id="apple-check">✓</span>
              </div>
              <div uiComboboxItem id="banana" value="banana" label="Banana">
                <span uiComboboxItemText>Banana</span>
              </div>
            </div>
            <div uiComboboxEmpty id="empty">No fruit found</div>
          </div>
        </ng-container>
      </div>
    </form>
  `,
})
class Parts {
  readonly value = signal<string | null>(null)
  readonly query = signal("")
}

@Component({
  selector: "test-root",
  imports: [
    Combobox,
    ComboboxChip,
    ComboboxChipRemove,
    ComboboxChips,
    ComboboxContent,
    ComboboxCreate,
    ComboboxInput,
    ComboboxItems,
    ComboboxList,
    ComboboxValue,
  ],
  template: `
    <ng-container
      uiCombobox
      multiple
      name="tags"
      [items]="items()"
      [(value)]="value"
    >
      <div uiComboboxChips id="chips">
        @for (tag of value(); track tag) {
          <span
            uiComboboxChip
            [value]="tag"
            [id]="'chip-' + tag"
            #chip="uiComboboxChip"
          >
            {{ chip.state().label }}
            <button
              uiComboboxChipRemove
              aria-label="Remove"
              [id]="'remove-' + tag"
            ></button>
          </span>
        }
        <input uiComboboxInput id="input" aria-label="Tags" />
      </div>
      <div *uiComboboxContent id="content">
        <div uiComboboxList id="list">
          <div uiComboboxItems></div>
          <div uiComboboxCreate id="create" (create)="add($event)"></div>
        </div>
      </div>
      <span *uiComboboxValue="{ maxLabels: 1 }; let selected" id="summary">
        {{ selected.label }}
      </span>
    </ng-container>
  `,
})
class Tags {
  readonly items = signal<ListData>(["Design", "Docs"])
  readonly value = signal<string[]>(["Design"])

  add(request: ComboboxCreateRequest) {
    this.items.update((items) => [...items, request.query])
    this.value.update((value) => [...value, request.query])
  }
}

const byId = (id: string) => document.getElementById(id)!
const type = (input: HTMLInputElement, value: string) => {
  input.focus()
  input.value = value
  input.dispatchEvent(new InputEvent("input", { bubbles: true }))
}
const options = () =>
  [...document.querySelectorAll("#list [role=option]:not([hidden])")].map(
    (option) => option.textContent?.trim()
  )

describe("combobox", () => {
  test("typing opens the list, filters it and marks what matched", async () => {
    const { instance, settle } = await mount(Parts)
    const input = byId("input") as HTMLInputElement
    expect(input.getAttribute("role")).toBe("combobox")
    expect(input.getAttribute("aria-expanded")).toBe("false")
    expect(input.getAttribute("aria-labelledby")).toContain("label")
    expect(document.getElementById("content")).toBeNull()

    type(input, "ban")
    await settle()
    expect(instance.query()).toBe("ban")
    expect(input.getAttribute("aria-expanded")).toBe("true")
    expect(byId("content").getAttribute("data-side")).toBe("bottom")
    expect(options()).toEqual(["Banana"])
    expect(byId("banana").innerHTML).toContain("<mark>Ban</mark>ana")

    type(input, "zzz")
    await settle()
    expect(options()).toEqual([])
    expect(byId("empty").textContent).toBe("No fruit found")
  })

  test("choosing an item sets the value, the text and the form's value", async () => {
    const { instance, settle } = await mount(Parts)
    const input = byId("input") as HTMLInputElement
    type(input, "a")
    await settle()
    expect(byId("apple-text").textContent).toBe("Apple")
    byId("apple").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toBe("apple")
    expect(instance.query()).toBe("Apple")
    expect(input.value).toBe("Apple")
    expect(input.getAttribute("aria-expanded")).toBe("false")
    const form = new FormData(byId("form") as HTMLFormElement)
    expect(form.get("fruit")).toBe("apple")
  })

  test("shows the values as chips, removes one and creates an item", async () => {
    const { instance, settle } = await mount(Tags)
    expect(byId("chip-Design").textContent?.trim()).toBe("Design")

    const input = byId("input") as HTMLInputElement
    type(input, "d")
    await settle()
    expect(options()).toEqual(["Design", "Docs", "Create “d”"])

    type(input, "Tests")
    await settle()
    expect(options()).toEqual(["Create “Tests”"])
    byId("create").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toEqual(["Design", "Tests"])
    expect(document.getElementById("chip-Tests")).not.toBeNull()

    byId("remove-Design").click()
    await settle()
    expect(instance.value()).toEqual(["Tests"])
    expect(document.getElementById("chip-Design")).toBeNull()
  })
})
