import { expect, test } from "../fixtures"
import { labelFixture } from "../fixtures/label"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture

test.beforeEach(async ({ open }) => {
  await open("label")
})

test("a label names a native input, and a press focuses it", async ({
  page,
}) => {
  await page.getByText(email.label, { exact: true }).click()
  await expect(page.getByRole("textbox", { name: email.label })).toBeFocused()
})

test("a label names a radio group, and a press focuses its checked radio", async ({
  page,
}) => {
  await expect(page.getByRole("radiogroup", { name: plan.label })).toBeVisible()
  await page.getByText(plan.label, { exact: true }).click()
  await expect(page.getByRole("radio", { name: "Pro" })).toBeFocused()
})

test("a label for a slider names its thumb, and a press focuses it", async ({
  page,
}) => {
  const thumb = page.getByRole("slider", { name: volume.label })
  await page.getByText(volume.label, { exact: true }).click()
  await expect(thumb).toBeFocused()
  await expect(thumb).toHaveValue(String(volume.defaultValue))
})

test("a label around a checkbox names it, and a press toggles it", async ({
  page,
}) => {
  const checkbox = page.getByRole("checkbox", { name: terms.label })
  await page.getByText(terms.label, { exact: true }).click()
  await expect(checkbox).toBeChecked()
  await checkbox.click()
  await expect(checkbox).not.toBeChecked()
})

test("a press on the label of a disabled group moves no focus", async ({
  page,
}) => {
  await expect(
    page.getByRole("radiogroup", { name: region.label })
  ).toBeVisible()
  await page.getByText(region.label, { exact: true }).click()
  await expect(page.getByRole("radio", { name: "East" })).not.toBeFocused()
})

test("a control its author names keeps that name", async ({ page }) => {
  await expect(
    page.getByRole("radiogroup", { name: delivery.name, exact: true })
  ).toBeVisible()
})

test("a label names a control that renders after it", async ({ page }) => {
  await page.getByRole("button", { name: quantity.show }).click()
  await page.getByText(quantity.label, { exact: true }).click()
  await expect(
    page.getByRole("textbox", { name: quantity.label })
  ).toBeFocused()
})

test("a double click on a label doesn't select its text", async ({ page }) => {
  await page.getByText(plan.label, { exact: true }).dblclick()
  expect(await page.evaluate(() => getSelection()?.toString())).toBe("")
})
