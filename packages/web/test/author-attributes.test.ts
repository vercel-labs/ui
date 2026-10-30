// @vitest-environment jsdom
// A name or typing hint written on a part's element replaces the
// part's own, and the attributes its behavior reads stay the part's.
import { expect, test } from "vitest"
import { defineCalendarElements } from "../src/calendar"
import { defineComboboxElements } from "../src/combobox"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

test("a calendar's Previous keeps the label written on its button, and Next gets its own", async () => {
  defineCalendarElements()
  document.body.innerHTML = `<ui-calendar month="2026-10"><ui-calendar-previous><button aria-label="Mois précédent">‹</button></ui-calendar-previous><ui-calendar-next><button>›</button></ui-calendar-next><ui-calendar-grid></ui-calendar-grid></ui-calendar>`
  await wait()
  const [previous, next] = document.querySelectorAll("button")
  expect(previous.getAttribute("aria-label")).toBe("Mois précédent")
  expect(next.getAttribute("aria-label")).toBe("Next month")
  next.click()
  await wait()
  expect(previous.getAttribute("aria-label")).toBe("Mois précédent")
})

test("a combobox input keeps the autocomplete written on it, and its role", async () => {
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineComboboxElements()
  document.body.innerHTML = `<ui-combobox><ui-combobox-input><input autocomplete="email" role="textbox"></ui-combobox-input></ui-combobox>`
  await wait()
  const input = document.querySelector("input")!
  expect(input.getAttribute("autocomplete")).toBe("email")
  expect(input.getAttribute("role")).toBe("combobox")
})
