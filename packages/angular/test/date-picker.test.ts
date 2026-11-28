// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import { CalendarGrid, CalendarHeading } from "../src/calendar"
import {
  DatePicker,
  DatePickerClear,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerPreset,
  DatePickerTrigger,
} from "../src/date-picker"
import { Field, FieldDescription, FieldLabel } from "../src/field"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [DatePicker],
  template: `
    <form id="form">
      <div
        uiDatePicker
        id="picker"
        name="due"
        locale="en-US"
        defaultMonth="2026-10"
        [(value)]="value"
      ></div>
    </form>
  `,
})
class Default {
  readonly value = signal<string | null>(null)
}

@Component({
  selector: "test-root",
  imports: [
    CalendarGrid,
    CalendarHeading,
    DatePicker,
    DatePickerClear,
    DatePickerContent,
    DatePickerHint,
    DatePickerInput,
    DatePickerPreset,
    DatePickerTrigger,
    Field,
    FieldDescription,
    FieldLabel,
  ],
  template: `
    <form id="form">
      <div uiField name="stay">
        <label uiFieldLabel id="label">Stay</label>
        <div
          uiDatePicker
          mode="range"
          locale="en-US"
          defaultMonth="2026-10"
          [(value)]="value"
          [(open)]="open"
        >
          <input uiDatePickerInput id="start" />
          <input uiDatePickerInput end id="end" aria-label="End" />
          <span uiDatePickerHint id="hint"></span>
          <button uiDatePickerTrigger id="trigger" type="button">Open</button>
          <button uiDatePickerClear id="clear" type="button">Clear</button>
          <div *uiDatePickerContent="{ side: 'bottom' }" id="content">
            <h2 uiCalendarHeading id="heading"></h2>
            <table uiCalendarGrid></table>
            <button
              uiDatePickerPreset
              id="preset"
              type="button"
              [value]="['2026-10-01', '2026-10-07']"
            >
              First week
            </button>
          </div>
        </div>
        <p uiFieldDescription id="description">When you arrive and leave.</p>
      </div>
    </form>
  `,
})
class Range {
  readonly value = signal<[string, string] | null>(null)
  readonly open = signal(false)
}

const byId = (id: string) => document.getElementById(id)!

describe("date picker", () => {
  test("left empty, it renders its input, trigger and calendar", async () => {
    const { instance, settle } = await mount(Default)
    const picker = byId("picker")
    const input = picker.querySelector("input")!
    const trigger = picker.querySelector("button")!
    expect(picker.querySelectorAll("input")).toHaveLength(1)
    expect(trigger.querySelector("svg")).not.toBeNull()
    expect(document.querySelector("table")).toBeNull()

    trigger.click()
    await settle()
    const days = [...document.querySelectorAll("td[data-slot]")]
    expect(document.querySelector("h2")?.textContent).toBe("October 2026")
    ;(days.find((day) => day.textContent === "16") as HTMLElement).click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toBe("2026-10-16")
    expect(input.value).toBe("10/16/2026")
    expect(new FormData(byId("form") as HTMLFormElement).get("due")).toBe(
      "2026-10-16"
    )
  })

  test("a range has two inputs, a hint, presets and a field's name", async () => {
    const { instance, settle } = await mount(Range)
    const start = byId("start") as HTMLInputElement
    expect(start.getAttribute("aria-labelledby")).toContain("label")
    expect(byId("hint").textContent).toBe("MM/DD/YYYY")
    expect(start.getAttribute("aria-describedby")?.split(" ")).toEqual([
      byId("hint").id,
      "description",
    ])
    expect(byId("end").getAttribute("aria-describedby")).toBe(byId("hint").id)

    byId("trigger").click()
    await settle()
    expect(instance.open()).toBe(true)
    expect(byId("content").getAttribute("data-side")).toBe("bottom")
    expect(byId("heading").textContent).toBe("October 2026")

    byId("preset").click()
    await settle()
    await new Promise((resolve) => setTimeout(resolve))
    await settle()
    expect(instance.value()).toEqual(["2026-10-01", "2026-10-07"])
    expect(start.value).toBe("10/01/2026")
    const form = new FormData(byId("form") as HTMLFormElement)
    expect(form.getAll("stay")).toEqual(["2026-10-01", "2026-10-07"])

    byId("clear").click()
    await settle()
    expect(instance.value()).toBeNull()
  })
})
