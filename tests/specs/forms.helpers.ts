import type { Page } from "@playwright/test"
import { expect } from "../fixtures"

// Controls are found by role and name. Every implementation names them from their labels.
const checkbox = (page: Page, name: string) =>
  page.getByRole("checkbox", { name, exact: true })
const switchNamed = (page: Page, name: string) =>
  page.getByRole("switch", { name, exact: true })
const radio = (page: Page, name: string) =>
  page.getByRole("radio", { name, exact: true })
const email = (page: Page) =>
  page.getByRole("textbox", { name: "Email", exact: true })
const form = (page: Page) => page.getByRole("form", { name: "Preferences" })

async function submitted(page: Page) {
  return page.getByRole("status", { name: "Submitted" }).textContent()
}

// Clicks Save and waits for the fixture to record what was submitted.
async function save(page: Page) {
  await page.getByRole("button", { name: "Save" }).click()
}

// Fills every required control, so the form can submit.
async function fillRequired(page: Page) {
  await checkbox(page, "Accept the terms").click()
  await expect(checkbox(page, "Accept the terms")).toBeChecked()
  await radio(page, "Pro").click()
  await expect(radio(page, "Pro")).toBeChecked()
  await email(page).fill("ada@example.com")
}

// What the form would submit right now, read from the browser.
async function formData(page: Page) {
  return page.evaluate(() => {
    const form = document.querySelector("form")!
    return new URLSearchParams(
      new FormData(form) as unknown as Record<string, string>
    ).toString()
  })
}

// Error parts have no role. They're found by the class every implementation
// gives them. Custom elements keep parts that aren't shown, hidden.
const errors = (page: Page) => page.locator(".field-error:visible")

export {
  checkbox,
  email,
  errors,
  fillRequired,
  form,
  formData,
  radio,
  save,
  submitted,
  switchNamed,
}
