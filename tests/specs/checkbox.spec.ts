import { expect, lastAction, test } from "../fixtures"
import { checkbox, fillRequired, submitted } from "./forms.helpers"

// Behavior follows the WAI-ARIA checkbox pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

test.describe("checkbox", () => {
  test.beforeEach(async ({ open }) => {
    await open("forms")
  })

  test("clicking toggles it", async ({ page }) => {
    const terms = checkbox(page, "Accept the terms")
    await expect(terms).toHaveAttribute("aria-checked", "false")
    await terms.click()
    await expect(terms).toHaveAttribute("aria-checked", "true")
    expect(await lastAction(page)).toBe("terms:true")
    await terms.click()
    await expect(terms).toHaveAttribute("aria-checked", "false")
    expect(await lastAction(page)).toBe("terms:false")
  })

  test("clicking its label toggles it", async ({ page }) => {
    await page.getByText("Accept the terms", { exact: true }).click()
    await expect(checkbox(page, "Accept the terms")).toBeChecked()
  })

  test("clicking a label around it toggles it once", async ({ page }) => {
    await page.getByText("Mushrooms", { exact: true }).click()
    await expect(checkbox(page, "Mushrooms")).toBeChecked()
    await page.getByText("Mushrooms", { exact: true }).click()
    await expect(checkbox(page, "Mushrooms")).not.toBeChecked()
  })

  test("Space toggles it", async ({ page }) => {
    const terms = checkbox(page, "Accept the terms")
    await terms.focus()
    await page.keyboard.press(" ")
    await expect(terms).toBeChecked()
    await page.keyboard.press(" ")
    await expect(terms).not.toBeChecked()
  })

  test("Enter submits the form and never toggles it", async ({ page }) => {
    await fillRequired(page)
    const olives = checkbox(page, "Olives")
    await olives.focus()
    await page.keyboard.press("Enter")
    await expect(olives).not.toBeChecked()
    await expect.poll(() => submitted(page)).toContain("terms=yes")
  })

  test("Tab moves through checkboxes in order", async ({ page, tab }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expect(checkbox(page, "Accept the terms")).toBeFocused()
    await tab()
    await expect(checkbox(page, "All toppings")).toBeFocused()
    await tab()
    await expect(checkbox(page, "Cheese")).toBeFocused()
  })

  test("the indicator shows only while checked", async ({ page }) => {
    const terms = checkbox(page, "Accept the terms")
    await expect(terms.locator(".checkbox-indicator")).toBeHidden()
    await terms.click()
    await expect(terms.locator(".checkbox-indicator")).toBeVisible()
    await terms.click()
    await expect(terms.locator(".checkbox-indicator")).toBeHidden()
  })

  test("a change can be cancelled", async ({ page, open }) => {
    await open("forms", { cancel: "terms" })
    await checkbox(page, "Accept the terms").click()
    await expect(checkbox(page, "Accept the terms")).not.toBeChecked()
  })

  test("a controlled checkbox follows its value", async ({ page, open }) => {
    await open("forms", { controlled: "" })
    const terms = checkbox(page, "Accept the terms")
    await terms.click()
    await expect(terms).toBeChecked()
    await terms.click()
    await expect(terms).not.toBeChecked()
  })

  test("a read-only checkbox can be focused but not changed", async ({
    page,
    open,
  }) => {
    await open("forms", { readonly: "" })
    const terms = checkbox(page, "Accept the terms")
    await expect(terms).toHaveAttribute("aria-readonly", "true")
    await terms.click()
    await terms.focus()
    await page.keyboard.press(" ")
    await expect(terms).toBeFocused()
    await expect(terms).not.toBeChecked()
    expect(await lastAction(page)).toBe("")
  })

  test("exit keyframes keyed on data-unchecked play before the indicator unmounts", async ({
    page,
    open,
  }) => {
    await open("forms")
    await page.addStyleTag({
      content:
        "@keyframes exit { to { opacity: 0 } } .checkbox-indicator[data-unchecked] { animation: exit 3s }",
    })
    const terms = checkbox(page, "Accept the terms")
    await terms.click()
    await expect(terms.locator(".checkbox-indicator")).toBeVisible()
    await terms.click()
    const exiting = terms.locator(
      ".checkbox-indicator[data-unchecked][data-ending-style]"
    )
    await expect(exiting).toHaveCount(1)
    expect(
      await exiting.evaluate((el) =>
        el
          .getAnimations()
          .some(
            (animation) => (animation as CSSAnimation).animationName === "exit"
          )
      )
    ).toBe(true)
  })

  test("an infinite exit animation still unmounts the indicator", async ({
    page,
    open,
  }) => {
    await open("forms", { animate: "infinite" })
    const terms = checkbox(page, "Accept the terms")
    await terms.click()
    await expect(terms.locator(".checkbox-indicator")).toBeVisible()
    await terms.click()
    await expect(terms.locator(".checkbox-indicator")).toBeHidden()
  })
})
