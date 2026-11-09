import type { Page } from "@playwright/test"
import { expect } from "../fixtures"

// Fields are found by role and name. Every implementation names them from their labels.
const textbox = (page: Page, name: string) =>
  page.getByRole("textbox", { name, exact: true })
const group = (page: Page, name: string) =>
  page.getByRole("group", { name, exact: true })

const status = (page: Page, name: "Last action" | "Submitted") =>
  page.getByRole("status", { name })

async function save(page: Page) {
  await page.getByRole("button", { name: "Save" }).click()
}

// Fills the one required field, so the form can submit.
async function fillRequired(page: Page, username = "ada") {
  await textbox(page, "Username").fill(username)
  await expect(textbox(page, "Username")).toHaveValue(username)
}

// Error parts have no role. They're found by the class every implementation
// gives them. Custom elements keep parts that aren't shown, hidden.
const errors = (page: Page) => page.locator(".field-error:visible")

// How many times the form called the fake server. A blocked submit never calls
// it, so a count of 0 right after one needs no waiting.
const saves = (page: Page) =>
  page.evaluate(
    () =>
      (globalThis as typeof globalThis & { formSaves?: number }).formSaves ?? 0
  )

export { errors, fillRequired, group, save, saves, status, textbox }
