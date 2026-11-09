import type { Locator } from "@playwright/test"
import { expect, test } from "../fixtures"

// Svelte's own `transition:` on a popup plays where the popup was: it stays
// in the top layer and visible until the outro ends, like a panel's does.

test.beforeEach(async ({ open }) => {
  await open("svelte-outro")
})

// Whether the element still shows while its outro runs.
const midOutro = (el: Locator) =>
  el.evaluate((node) => ({
    visible: node.checkVisibility(),
    animations: node.getAnimations().length,
    top: node.closest("[popover]")?.matches(":popover-open") ?? false,
  }))

test("a popup's Svelte outro stays visible until it ends", async ({ page }) => {
  await page.getByRole("button", { name: "Open" }).click()
  const popup = page.getByText("Popup content")
  await expect(popup).toBeVisible()
  await page.waitForTimeout(700)
  await page.keyboard.press("Escape")
  await page.waitForTimeout(100)
  expect(await midOutro(popup)).toEqual({
    visible: true,
    animations: 1,
    top: true,
  })
  await expect(popup).toHaveCount(0)
})

test("a popup opened again during its outro stays open, and closes again", async ({
  page,
}) => {
  const trigger = page.getByRole("button", { name: "Open" })
  await trigger.click()
  const popup = page.getByText("Popup content")
  await page.waitForTimeout(700)
  await page.keyboard.press("Escape")
  await page.waitForTimeout(100)
  await trigger.click()
  await page.waitForTimeout(700)
  expect(await midOutro(popup)).toEqual({
    visible: true,
    animations: 0,
    top: true,
  })
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(popup).toHaveCount(0)
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
})

test("a panel's Svelte outro stays visible until it ends", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Details" })
  await trigger.click()
  const panel = page.getByText("Panel content")
  await expect(panel).toBeVisible()
  await page.waitForTimeout(700)
  await trigger.click()
  await page.waitForTimeout(100)
  expect(await midOutro(panel)).toMatchObject({ visible: true, animations: 1 })
  await expect(panel).toHaveCount(0)
})

for (const layout of ["viewport", "none"]) {
  test(`a navigation menu content shown again during its outro still completes the close (${layout === "none" ? "no viewport" : "viewport"})`, async ({
    page,
    open,
  }) => {
    await open("svelte-outro", layout === "none" ? { viewport: "none" } : {})
    // The panels cover the triggers, so the keyboard presses them.
    const press = async (name: string) => {
      await page.getByRole("button", { name, exact: true }).focus()
      await page.keyboard.press("Enter")
    }
    const completed = page.getByRole("status", { name: "Completed" })
    await press("One")
    await expect(completed).toHaveText("true")
    await page.waitForTimeout(700)
    await press("Two")
    await page.waitForTimeout(100)
    expect(await midOutro(page.getByText("One content"))).toMatchObject({
      visible: true,
      animations: 1,
    })
    await press("One")
    await expect(
      page.getByRole("button", { name: "One", exact: true })
    ).toHaveAttribute("aria-expanded", "true")
    await page.waitForTimeout(700)
    await page.keyboard.press("Escape")
    await expect(page.getByText("One content")).toHaveCount(0)
    await expect(completed).toHaveText("true,false")
  })
}

for (const layout of ["viewport", "none"]) {
  test(`a navigation menu closed during its intro still completes the close (${layout === "none" ? "no viewport" : "viewport"})`, async ({
    page,
    open,
  }) => {
    await open("svelte-outro", layout === "none" ? { viewport: "none" } : {})
    const press = async (name: string) => {
      await page.getByRole("button", { name, exact: true }).focus()
      await page.keyboard.press("Enter")
    }
    const completed = page.getByRole("status", { name: "Completed" })
    await press("One")
    await page.waitForTimeout(100)
    await page.keyboard.press("Escape")
    await expect(page.getByText("One content")).toHaveCount(0)
    await expect(completed).toHaveText("false")
    await press("One")
    await expect(completed).toHaveText("false,true")
    await page.keyboard.press("Escape")
    await expect(completed).toHaveText("false,true,false")
  })
}
