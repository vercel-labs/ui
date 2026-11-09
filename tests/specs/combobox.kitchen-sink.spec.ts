import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, positions and closes without errors.
test("every kitchen sink variant opens", async ({ page, framework }) => {
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

  await page.goto(`/?fixture=combobox-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Disabled and read-only comboboxes don't open, by design.
  const inputs = page.locator(
    '[data-slot="combobox-input"]:not([disabled], [readonly])'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => inputs.count()).toBeGreaterThan(65)
  const count = await inputs.count()

  for (let index = 0; index < count; index++) {
    const input = inputs.nth(index)
    await input.scrollIntoViewIfNeeded()
    // Cards and pinned wrappers carry their variant's id.
    const name = await input.evaluate(
      (el) => el.closest<HTMLElement>("[data-variant]")?.dataset.variant ?? ""
    )
    await input.focus()
    await page.keyboard.press("ArrowDown")
    const popup = page
      .locator('[data-slot="combobox-content"][data-open]')
      .first()
    await expect(popup, name).toBeVisible()
    await expect(popup, name).toHaveAttribute(
      "data-side",
      /top|right|bottom|left/
    )
    await page.keyboard.press("Escape")
    await expect(
      page.locator('[data-slot="combobox-content"][data-open]'),
      `${name} closes`
    ).toHaveCount(0)
    // A popup animating out still swallows presses that land on it, and it may cover the next input.
    await expect(page.locator("[data-ending-style]")).toHaveCount(0)
  }

  expect(errors).toEqual([])
})
