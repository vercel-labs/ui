import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, positions and closes without errors.
test("every kitchen sink variant opens", async ({ page, framework }) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  test.setTimeout(90_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )

  await page.goto(`/?fixture=popover-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Nested popovers' triggers are inside closed popovers, so they aren't counted.
  const triggers = page.locator(
    '[data-slot="popover-trigger"]:not([data-slot="popover-content"] *, ui-popover-content *)'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(40)
  const count = await triggers.count()

  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const popup = page.locator('[role="dialog"][data-open]').first()
    await expect(popup, `variant ${index}`).toBeVisible()
    await expect(
      popup,
      `variant ${index}: ${await trigger.textContent()}`
    ).toHaveAttribute("data-side", /top|right|bottom|left/)
    await page.keyboard.press("Escape")
    await expect(
      page.locator('[role="dialog"][data-open]'),
      `variant ${index} closes`
    ).toHaveCount(0)
    // A popup animating out still swallows presses that land on it, and it may cover the next trigger.
    await expect(page.locator("[data-ending-style]")).toHaveCount(0)
  }

  expect(errors).toEqual([])
})
