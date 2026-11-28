// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItems,
  AutocompleteItemText,
  AutocompleteList,
  type AutocompleteSubmit,
  type ListData,
} from "../src/autocomplete"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteEmpty,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteItemText,
    AutocompleteList,
  ],
  template: `
    <form id="form">
      <ng-container
        uiAutocomplete
        name="city"
        [(value)]="value"
        (submit)="submitted.set($event)"
      >
        <input uiAutocompleteInput id="input" aria-label="City" />
        <div *uiAutocompleteContent="{ side: 'bottom' }" id="content">
          <div uiAutocompleteList id="list">
            <div uiAutocompleteItem id="lisbon" value="Lisbon">Lisbon</div>
            <div uiAutocompleteItem id="lima" value="lima" label="Lima">
              <span uiAutocompleteItemText id="lima-text"></span>
            </div>
          </div>
          <div uiAutocompleteEmpty id="empty">No city found</div>
        </div>
      </ng-container>
    </form>
  `,
})
class Cities {
  readonly value = signal("")
  readonly submitted = signal<AutocompleteSubmit | null>(null)
}

@Component({
  selector: "test-root",
  imports: [
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItems,
    AutocompleteList,
  ],
  template: `
    <ng-container uiAutocomplete [items]="items">
      <input uiAutocompleteInput id="input" aria-label="City" />
      <div *uiAutocompleteContent>
        <div uiAutocompleteList id="list">
          <div uiAutocompleteItems></div>
        </div>
      </div>
    </ng-container>
  `,
})
class Data {
  readonly items: ListData<string> = [
    "Lisbon",
    { type: "group", label: "Asia", items: ["Lahore"] },
  ]
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

describe("autocomplete", () => {
  test("typing opens the suggestions and filters them", async () => {
    const { instance, settle } = await mount(Cities)
    const input = byId("input") as HTMLInputElement
    expect(input.getAttribute("role")).toBe("combobox")
    expect(input.getAttribute("name")).toBe("city")
    expect(document.getElementById("content")).toBeNull()

    type(input, "l")
    await settle()
    expect(instance.value()).toBe("l")
    expect(byId("content").getAttribute("data-side")).toBe("bottom")
    expect(options()).toEqual(["Lisbon", "Lima"])
    expect(byId("lima-text").innerHTML).toBe("<mark>L</mark>ima")

    type(input, "lis")
    await settle()
    expect(options()).toEqual(["Lisbon"])

    type(input, "zzz")
    await settle()
    expect(options()).toEqual([])
    expect(byId("empty").textContent).toBe("No city found")
  })

  test("choosing a suggestion fills the field in with its text", async () => {
    const { instance, settle } = await mount(Cities)
    const input = byId("input") as HTMLInputElement
    type(input, "li")
    await settle()
    byId("lima").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toBe("Lima")
    expect(input.value).toBe("Lima")
    expect(input.getAttribute("aria-expanded")).toBe("false")
    expect(new FormData(byId("form") as HTMLFormElement).get("city")).toBe(
      "Lima"
    )

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await settle()
    expect(instance.submitted()?.value).toBe("Lima")
  })

  test("renders the data suggestions that match", async () => {
    const { settle } = await mount(Data)
    type(byId("input") as HTMLInputElement, "l")
    await settle()
    expect(options()).toEqual(["Lisbon", "Lahore"])
    expect(document.querySelector("#list [role=group]")).not.toBeNull()

    type(byId("input") as HTMLInputElement, "lah")
    await settle()
    expect(options()).toEqual(["Lahore"])
  })
})
