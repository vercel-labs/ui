import { expect, lastAction, test } from "../fixtures"
import {
  checkbox,
  fillRequired,
  formData,
  save,
  submitted,
} from "./forms.helpers"

// Checkboxes that share a name, with a parent that checks them all, like the
// mixed checkbox in the WAI-ARIA checkbox pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/

const children = ["Cheese", "Mushrooms", "Olives"]

test.beforeEach(async ({ open }) => {
  await open("forms")
})

test("the group is named by its label", async ({ page }) => {
  await expect(
    page.getByRole("group", { name: "Toppings", exact: true }).last()
  ).toBeVisible()
})

test("starts on its default value", async ({ page }) => {
  await expect(checkbox(page, "Cheese")).toBeChecked()
  await expect(checkbox(page, "Mushrooms")).not.toBeChecked()
  await expect(checkbox(page, "Olives")).not.toBeChecked()
})

test("checking a checkbox adds its value to the group", async ({ page }) => {
  await checkbox(page, "Olives").click()
  await expect(checkbox(page, "Olives")).toBeChecked()
  await expect.poll(() => lastAction(page)).toBe("toppings:cheese,olives")
  await checkbox(page, "Cheese").click()
  await expect.poll(() => lastAction(page)).toBe("toppings:olives")
})

test("every checked value submits under the group's name, in order", async ({
  page,
}) => {
  await checkbox(page, "Olives").click()
  await checkbox(page, "Mushrooms").click()
  await expect
    .poll(() => formData(page))
    .toContain("toppings=cheese&toppings=mushrooms&toppings=olives")
})

test(
  "a reset returns to the default value",
  { tag: "@enhancement" },
  async ({ page }) => {
    await checkbox(page, "Cheese").click()
    await checkbox(page, "Olives").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(checkbox(page, "Cheese")).toBeChecked()
    await expect(checkbox(page, "Olives")).not.toBeChecked()
    await expect(checkbox(page, "All toppings")).toHaveAttribute(
      "aria-checked",
      "mixed"
    )
  }
)

test.describe("parent checkbox", () => {
  test("is mixed while some checkboxes are checked", async ({ page }) => {
    const parent = checkbox(page, "All toppings")
    await expect(parent).toHaveAttribute("aria-checked", "mixed")
    await checkbox(page, "Cheese").click()
    await expect(parent).toHaveAttribute("aria-checked", "false")
    await checkbox(page, "Olives").click()
    await expect(parent).toHaveAttribute("aria-checked", "mixed")
  })

  test("checks every checkbox from mixed, then unchecks them all", async ({
    page,
  }) => {
    const parent = checkbox(page, "All toppings")
    await parent.click()
    await expect(parent).toHaveAttribute("aria-checked", "true")
    for (const name of children) {
      await expect(checkbox(page, name)).toBeChecked()
    }
    await parent.click()
    await expect(parent).toHaveAttribute("aria-checked", "false")
    for (const name of children) {
      await expect(checkbox(page, name)).not.toBeChecked()
    }
  })

  test("is checked once every checkbox is", async ({ page }) => {
    await checkbox(page, "Mushrooms").click()
    await checkbox(page, "Olives").click()
    await expect(checkbox(page, "All toppings")).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  test("submits nothing itself", async ({ page }) => {
    await checkbox(page, "All toppings").click()
    await expect.poll(() => formData(page)).toContain("toppings=olives")
    expect(await formData(page)).not.toContain("toppings=on")
  })
})

test(
  "a required group blocks submission until one is checked",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms", { "toppings-required": "" })
    await fillRequired(page)
    await checkbox(page, "Cheese").click()
    await save(page)
    // The blocked submit sends focus to the group's first checkbox.
    await expect(checkbox(page, "Cheese")).toBeFocused()
    expect(await submitted(page)).toBe("")
    // Firefox's validation message, once it shows, swallows the next pointer
    // press anywhere on the page, and Escape doesn't close it. It shows a few
    // hundred milliseconds after the submit, so a click races it. The keyboard
    // reaches the page either way: Space checks, and Enter submits.
    const olives = checkbox(page, "Olives")
    await olives.focus()
    await page.keyboard.press(" ")
    await expect(olives).toBeChecked()
    await page.keyboard.press("Enter")
    await expect.poll(() => submitted(page)).toContain("toppings=olives")
  }
)
