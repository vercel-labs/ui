import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { amount, button, quantity, save, status } from "./number-input.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("number inputs hydrate without mismatches", async ({ page, open }) => {
  await open("number-input")
  await button(page, "Increase quantity").click()
  await expect(quantity(page)).toHaveValue("2")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server markup shows formatted values and submits the numbers", async ({
  page,
  open,
}) => {
  await open("number-input", { hydrate: "manual" })
  await expect(page.locator(".number-input-control").nth(1)).toHaveValue(
    "$1,234.50"
  )
  const data = await page.evaluate(() =>
    new URLSearchParams(
      new FormData(document.querySelector("form")!) as unknown as Record<
        string,
        string
      >
    ).toString()
  )
  expect(data).toBe("quantity=1&amount=1234.5")
})

test("number inputs work after hydrating late", async ({ page, open }) => {
  await open("number-input", { hydrate: "manual" })
  await page.evaluate(() =>
    (window as unknown as { hydrate: () => void }).hydrate()
  )
  await amount(page).fill("20")
  await save(page)
  await expect
    .poll(() => status(page, "Submitted"))
    .toBe("quantity=1&amount=20")
  expect(await hydrationErrors(page)).toEqual([])
})
