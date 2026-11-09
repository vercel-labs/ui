import { expect, test } from "../fixtures"

// Presses every variant's button with every placement, then dismisses them.
// The page is for manual testing, so this only proves every variant shows a
// toast and the page throws no errors.
test("every kitchen sink variant shows a toast", async ({
  page,
  framework,
}) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  test.setTimeout(120_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )
  await page.goto(`/?fixture=toast-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const variants = page.locator("[data-variant]")
  await expect(variants.first()).toBeVisible()
  const region = page.locator('[data-slot="toast-region"]')
  const toasts = page.locator('[data-slot="toast-root"]')

  for (const [side, align] of [
    ["bottom", "end"],
    ["top", "center"],
  ]) {
    await page.locator('select[name="side"]').selectOption(side)
    await page.locator('select[name="align"]').selectOption(align)
    await expect(region).toHaveAttribute("data-side", side)
    for (let index = 0; index < (await variants.count()); index++) {
      const variant = variants.nth(index)
      const label = await variant.textContent()
      if (label === "Dismiss all" || label === "Update after close") {
        continue
      }
      await variant.click()
      await expect(toasts.first(), label!).toBeVisible()
    }
    await page.getByRole("button", { name: "Dismiss all", exact: true }).click()
    await expect(
      page.getByRole("region", { name: "Notifications" })
    ).toHaveCount(0)
  }

  await page
    .getByRole("button", { name: "Update after close", exact: true })
    .click()
  await expect(page.getByLabel("Event log")).toContainText(
    "update after close: false"
  )
  expect(errors).toEqual([])
})
