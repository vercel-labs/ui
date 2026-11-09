import { expect, test } from "../fixtures"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders, responds and resets without errors.
test("every slider kitchen sink variant works", async ({ page, framework }) => {
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

  await page.goto(`/?fixture=slider-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(35)
  const count = await cards.count()
  // Each card mounts its own app, so wait for every thumb.
  await expect
    .poll(() => page.locator('input[type="range"]').count())
    .toBeGreaterThan(count + 10)

  for (let index = 0; index < count; index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const thumb = card.locator('input[type="range"]').last()
    await card.scrollIntoViewIfNeeded()
    await expect(
      card.locator('[role="group"]').first(),
      `${name} renders`
    ).toBeVisible()
    await expect(
      card.locator("output, ui-slider-value").first(),
      `${name} shows its value`
    ).not.toBeEmpty()
    if (await thumb.isEnabled()) {
      await thumb.focus()
      await page.keyboard.press("ArrowRight")
      await expect(
        card.locator("[data-commit]"),
        `${name} commits`
      ).not.toHaveText("none")
    }
    await card.getByRole("button", { name: "Reset" }).click()
  }

  expect(errors).toEqual([])
})
