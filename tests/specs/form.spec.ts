import { expect, test } from "../fixtures"
import { errors, fillRequired, save, saves, status, textbox } from "./form.helpers"

// A native form with fields: the browser blocks an invalid submit, and the page
// shows the server's errors on the fields they name through `invalid`.

test.beforeEach(async ({ open }) => {
  await open("form")
})

test("a valid submit sends the form's data", async ({ page }) => {
  await fillRequired(page)
  await save(page)
  await expect(status(page, "Submitted")).toHaveText("username=ada&bio=&email=ada%40example.com&website=")
})

test("invalid controls stop the submit and the first one takes focus", async ({ page }) => {
  await textbox(page, "Email").fill("not an email")
  await save(page)
  await expect(textbox(page, "Username")).toBeFocused()
  await expect(textbox(page, "Username")).toHaveAttribute("aria-invalid", "true")
  await expect(textbox(page, "Email")).toHaveAttribute("aria-invalid", "true")
  expect(await saves(page)).toBe(0)
})

test("an error from the server shows on the field with its name", async ({ page }) => {
  await fillRequired(page, "taken")
  await save(page)
  await expect(errors(page).filter({ hasText: "That username is taken." })).toBeVisible()
  await expect(textbox(page, "Username")).toHaveAttribute("aria-invalid", "true")
  await expect(textbox(page, "Username")).toHaveAccessibleDescription(
    "Letters and numbers, at least 3. That username is taken.",
  )
})

test(
  "once its field changes, an error from the server goes away",
  { tag: "@enhancement" },
  async ({ page }) => {
    await fillRequired(page, "taken")
    await save(page)
    await expect(errors(page).filter({ hasText: "That username is taken." })).toBeVisible()
    await textbox(page, "Username").fill("taken2")
    await expect(errors(page).filter({ hasText: "That username is taken." })).toBeHidden()
    await expect(textbox(page, "Username")).not.toHaveAttribute("aria-invalid", "true")
    await save(page)
    await expect(status(page, "Submitted")).toContainText("username=taken2")
  },
)

test("errors passed at first render show before any submit, every message for a name", async ({
  page,
  open,
}) => {
  await open("form", { errors: "" })
  await expect(page.getByText("This email bounced.")).toBeVisible()
  await expect(textbox(page, "Email")).toHaveAttribute("aria-invalid", "true")
  await expect(page.getByText("Too long. No links allowed.")).toBeVisible()
  await expect(textbox(page, "Bio")).toHaveAttribute("aria-invalid", "true")
})

test("a reset hides the browser's errors and the server's", { tag: "@enhancement" }, async ({ page }) => {
  await save(page)
  await expect(errors(page)).not.toHaveCount(0)
  await page.getByRole("button", { name: "Reset" }).click()
  await expect(errors(page)).toHaveCount(0)

  await fillRequired(page, "taken")
  await save(page)
  await expect(errors(page).filter({ hasText: "That username is taken." })).toBeVisible()
  await page.getByRole("button", { name: "Reset" }).click()
  await expect(errors(page)).toHaveCount(0)
  await expect(textbox(page, "Username")).toHaveValue("")
  await expect(textbox(page, "Email")).toHaveValue("ada@example.com")
})
