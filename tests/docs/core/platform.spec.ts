import { expect } from "@playwright/test"
import { test } from "../docs-test"
import { openExamples } from "./behaviors/helpers"

const url = "/docs/core/platform"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, url)
  await expect(page.locator("[data-example]")).toHaveCount(3)
  expect(errors).toEqual([])
})

test("announce: copying says Copied through the shared live region", async ({ page }) => {
  await openExamples(page, url)
  const button = page.getByRole("button", { name: "Copy command" })
  await button.scrollIntoViewIfNeeded()
  await button.click()
  await expect(button).toHaveText("Copied")
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText("Copied")
  await expect(button).toHaveText("Copy", { timeout: 3000 })
})

test("direction: the arrows follow the text, and swap right to left", async ({ page }) => {
  await openExamples(page, url)
  const pager = page.getByRole("spinbutton", { name: "Page" })
  await expect(pager).toHaveAttribute("dir", "ltr")
  await expect(page.getByText("Next page: → Right arrow", { exact: true })).toBeVisible()
  await pager.focus()
  await page.keyboard.press("ArrowRight")
  await expect(pager).toHaveAttribute("aria-valuenow", "2")
  await page.getByRole("checkbox", { name: "Right to left" }).check()
  await expect(pager).toHaveAttribute("dir", "rtl")
  await expect(page.getByText("Next page: ← Left arrow", { exact: true })).toBeVisible()
  await pager.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(pager).toHaveAttribute("aria-valuenow", "3")
  await page.keyboard.press("ArrowRight")
  await expect(pager).toHaveAttribute("aria-valuenow", "2")
})

test("shortcuts: the platform's label, aria-keyshortcuts, and the keys toggle bold", async ({ page }) => {
  await openExamples(page, url)
  const bold = page.getByRole("button", { name: /^Bold/ })
  await expect(bold).toHaveAttribute("aria-keyshortcuts", "Control+B")
  await expect(bold.locator("kbd")).toHaveText("\u2066Ctrl+B\u2069")
  await page.getByRole("textbox", { name: "Note" }).focus()
  await page.keyboard.press("Control+b")
  await expect(bold).toHaveAttribute("aria-pressed", "true")
  await bold.click()
  await expect(bold).toHaveAttribute("aria-pressed", "false")
})
