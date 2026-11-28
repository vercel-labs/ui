// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Calendar,
  CalendarDay,
  CalendarGrid,
  type CalendarGridCell,
  CalendarHeading,
  CalendarMonthSelect,
  CalendarNext,
  CalendarWeekdays,
  CalendarWeeks,
} from "../src/calendar"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Calendar],
  template: `
    <div
      uiCalendar
      id="calendar"
      locale="en-US"
      defaultMonth="2026-10"
      [months]="2"
      [(value)]="value"
    ></div>
  `,
})
class Default {
  readonly value = signal<string | null>(null)
}

@Component({
  selector: "test-root",
  imports: [
    Calendar,
    CalendarDay,
    CalendarGrid,
    CalendarHeading,
    CalendarMonthSelect,
    CalendarNext,
    CalendarWeekdays,
    CalendarWeeks,
  ],
  template: `
    <div uiCalendar locale="en-US" mode="range" [(month)]="month">
      <h2 uiCalendarHeading id="heading"></h2>
      <select uiCalendarMonthSelect id="months" aria-label="Month"></select>
      <button uiCalendarNext id="next" type="button">Next</button>
      <table uiCalendarGrid #grid="uiCalendarGrid" id="grid">
        <caption>
          {{
            grid.state().label
          }}
        </caption>
        <thead uiCalendarWeekdays></thead>
        <tbody uiCalendarWeeks>
          <ng-template let-cell>
            <td uiCalendarDay [value]="cell.date" [id]="cell.date">
              {{ day(cell) }}
            </td>
          </ng-template>
        </tbody>
      </table>
    </div>
  `,
})
class Parts {
  readonly month = signal("2026-10")

  day(cell: CalendarGridCell) {
    return Number(cell.date.slice(-2))
  }
}

const byId = (id: string) => document.getElementById(id)!

describe("calendar", () => {
  test("left empty, it renders its heading and a grid per month", async () => {
    const { instance, settle } = await mount(Default)
    const calendar = byId("calendar")
    expect(calendar.querySelector("h2")?.textContent).toContain("October")
    expect(calendar.querySelectorAll("table")).toHaveLength(2)
    const first = calendar.querySelector("table")!
    expect(first.querySelectorAll("thead th")).toHaveLength(7)
    expect(first.querySelector("thead th")?.getAttribute("scope")).toBe("col")
    const days = [...first.querySelectorAll("tbody td[data-slot]")]
    expect(days.map((day) => day.textContent)).toContain("31")

    const day = days.find((cell) => cell.textContent === "16") as HTMLElement
    day.click()
    await settle()
    expect(instance.value()).toBe("2026-10-16")
    expect(day.getAttribute("aria-selected")).toBe("true")

    const next = calendar.querySelectorAll("button")[1]!
    expect(next.textContent).toBe("›")
    next.click()
    await settle()
    expect(calendar.querySelector("h2")?.textContent).toContain("November")
  })

  test("renders your own days, and the selects turn the month", async () => {
    const { instance, settle } = await mount(Parts)
    expect(byId("heading").textContent).toBe("October 2026")
    expect(byId("grid").querySelector("caption")?.textContent?.trim()).toBe(
      "October 2026"
    )
    expect(byId("2026-10-05").textContent?.trim()).toBe("5")
    expect(byId("2026-10-05").getAttribute("data-slot")).toBe("calendar-day")

    const months = byId("months") as HTMLSelectElement
    expect(months.options).toHaveLength(12)
    expect(months.value).toBe("10")
    months.value = "12"
    months.dispatchEvent(new Event("change", { bubbles: true }))
    await settle()
    expect(instance.month()).toBe("2026-12")
    expect(document.getElementById("2026-12-25")).not.toBeNull()

    byId("next").click()
    await settle()
    expect(instance.month()).toBe("2027-01")
    expect(byId("heading").textContent).toBe("January 2027")
  })
})
