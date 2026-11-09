import { expect, test } from "../fixtures"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders, responds and resets without errors.
test("every number input kitchen sink variant works", async ({
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

  await page.goto(`/?fixture=number-input-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(30)
  const count = await cards.count()
  // Each card mounts its own app, so wait for every input.
  await expect
    .poll(() => page.getByRole("group").count())
    .toBeGreaterThanOrEqual(count)

  for (let index = 0; index < count; index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const input = card.locator('[role="group"] input').first()
    await card.scrollIntoViewIfNeeded()
    await expect(input, `${name} renders`).toBeVisible()
    // At its max, or read-only, the value can't go up.
    const increase = card.getByRole("button", { name: "Increase" })
    if ((await input.isEditable()) && (await increase.isEnabled())) {
      const before = await input.inputValue()
      await input.focus()
      await page.keyboard.press("ArrowUp")
      await expect(input, `${name} steps up`).not.toHaveValue(before)
      await expect(
        card.locator("[data-commit]"),
        `${name} commits`
      ).not.toHaveText("none")
    }
    await card.getByRole("button", { name: "Reset" }).click()
  }

  expect(errors).toEqual([])
})
