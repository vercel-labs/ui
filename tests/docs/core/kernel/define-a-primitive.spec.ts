import { expect } from "@playwright/test"
import { test } from "../../docs-test"
import { openExamples } from "../behaviors/helpers"

const url = "/docs/core/kernel/define-a-primitive"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openExamples(page, url)
  await expect(page.locator("[data-example]")).toHaveCount(4)
  expect(errors).toEqual([])
})

test("options: the copy button copies its text, shows it's copied, and resets", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await openExamples(page, url)
  const copy = page.getByRole("button", { name: "Copy", exact: true })
  await expect(copy).not.toHaveAttribute("data-copied")
  await copy.click()
  await expect(
    page.getByRole("button", { name: "Copied", exact: true })
  ).toHaveAttribute("data-copied", "")
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "npm install @ui-sdk/core"
  )
  await expect(copy).toBeVisible({ timeout: 3000 })
  await expect(copy).not.toHaveAttribute("data-copied")
})

test("events: typing filters, Escape and the clear button empty the field", async ({
  page,
}) => {
  await openExamples(page, url)
  const input = page.getByRole("searchbox", { name: "Search fruit" })
  const clear = page.getByRole("button", { name: "Clear" })
  await expect(clear).toHaveCount(0)
  await input.fill("pe")
  await expect(page.getByText("Grape, Peach, Pear")).toBeVisible()
  await expect(clear).toBeVisible()
  await input.press("Escape")
  await expect(input).toHaveValue("")
  await expect(clear).toHaveCount(0)
  await input.fill("ch")
  await clear.click()
  await expect(input).toHaveValue("")
})

test("working with the element: the textarea grows as you type", async ({
  page,
}) => {
  await openExamples(page, url)
  const box = page.getByRole("textbox", { name: "Message" })
  const before = (await box.boundingBox())!.height
  await box.fill("One\nTwo\nThree\nFour")
  await expect
    .poll(async () => (await box.boundingBox())!.height)
    .toBeGreaterThan(before + 30)
})

test("reading parts in the api: the button finds the first empty field in page order", async ({
  page,
}) => {
  await openExamples(page, url)
  const next = page.getByRole("button", { name: "Find Empty Field" })
  await next.click()
  await expect(page.getByRole("textbox", { name: "Email" })).toBeFocused()
  await expect(
    page.getByRole("button", { name: "Fill In Email" })
  ).toBeVisible()
  await page.getByRole("textbox", { name: "Email" }).fill("hollis@example.com")
  await page.getByRole("button", { name: "Fill In Email" }).click()
  await expect(page.getByRole("textbox", { name: "Address" })).toBeFocused()
  await page.getByRole("textbox", { name: "Address" }).fill("1 Main Street")
  await page.getByRole("button", { name: "Fill In Address" }).click()
  await expect(
    page.getByRole("button", { name: "Find Empty Field" })
  ).toBeVisible()
})

test("every field in the API reference links to the example that shows it", async ({
  page,
}) => {
  await openExamples(page, url)
  const elsewhere: string[] = []
  for (const label of ["PrimitiveDefinition", "SlotDefinition"]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const href = (await link.evaluate((a) => (a as HTMLAnchorElement).href))!
      if (new URL(href).pathname === url) {
        await expect(
          page.locator(`[id="${new URL(href).hash.slice(1)}"]`)
        ).toHaveCount(1)
      } else {
        elsewhere.push(href)
      }
    }
  }
  for (const href of new Set(elsewhere)) {
    await page.goto(href)
    await expect(
      page.locator(`[id="${new URL(href).hash.slice(1)}"]`)
    ).toHaveCount(1)
  }
})
