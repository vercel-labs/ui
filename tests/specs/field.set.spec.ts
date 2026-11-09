import { expect, test } from "../fixtures"
import { group, save, status, textbox } from "./form.helpers"

// A FieldSet groups fields under its legend, and disabling it disables every
// control inside, the way a native fieldset does.

test("the legend names the group", async ({ page, open }) => {
  await open("form")
  await expect(group(page, "Profile")).toBeVisible()
  await expect(group(page, "Contact")).toBeVisible()
})

test("a disabled field set disables the controls inside and leaves them out of the form", async ({
  page,
  open,
}) => {
  await open("form")
  await page.getByRole("button", { name: "Toggle contact" }).click()
  await expect(textbox(page, "Email")).toBeDisabled()
  await expect(textbox(page, "Website")).toBeDisabled()
  await textbox(page, "Username").fill("ada")
  await save(page)
  await expect(status(page, "Submitted")).toHaveText("username=ada&bio=")
})

test("enabling it again restores the controls", async ({ page, open }) => {
  await open("form")
  await page.getByRole("button", { name: "Toggle contact" }).click()
  await expect(textbox(page, "Email")).toBeDisabled()
  await page.getByRole("button", { name: "Toggle contact" }).click()
  await expect(textbox(page, "Email")).toBeEnabled()
})

test("a field set disabled from the start disables its required fields", async ({
  page,
  open,
}) => {
  await open("form", { disabled: "" })
  await expect(textbox(page, "Username")).toBeDisabled()
  await expect(textbox(page, "Bio")).toBeDisabled()
  // Disabled controls don't validate, so the form submits without the username.
  await save(page)
  await expect(status(page, "Submitted")).toHaveText(
    "email=ada%40example.com&website="
  )
})

test("fields in a disabled field set mark their parts disabled", async ({
  page,
  open,
}) => {
  await open("form")
  await page.getByRole("button", { name: "Toggle contact" }).click()
  await expect(page.getByText("Email", { exact: true })).toHaveAttribute(
    "data-disabled",
    ""
  )
  await expect(group(page, "Contact")).toHaveAttribute("data-disabled", "")
  await page.getByRole("button", { name: "Toggle contact" }).click()
  await expect(page.getByText("Email", { exact: true })).not.toHaveAttribute(
    "data-disabled"
  )
})

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("the description describes the group", async ({ page, open }) => {
    await open("form")
    await expect(group(page, "Profile")).toHaveAccessibleDescription(
      "Shown on your public page."
    )
  })
})
