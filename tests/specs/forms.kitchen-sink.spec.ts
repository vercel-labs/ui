import { expect, test } from "../fixtures"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders, responds and resets without errors.
test("every form controls kitchen sink variant works", async ({
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

  await page.goto(`/?fixture=forms-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(40)
  // Each card mounts its own app, so wait for every control.
  await expect
    .poll(() =>
      page
        .locator(
          '[role="checkbox"], [role="switch"], [role="radio"], input[type="email"]'
        )
        .count()
    )
    .toBeGreaterThan(55)

  for (let index = 0; index < (await cards.count()); index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const control = card
      .locator(
        '[role="checkbox"], [role="switch"], [role="radio"], input[type="email"]'
      )
      .first()
    await control.scrollIntoViewIfNeeded()
    const enabled = await control.isEnabled()
    if ((await control.getAttribute("type")) === "email") {
      if (enabled) {
        await control.fill("someone@example.com")
      }
    } else if (enabled) {
      await control.click({ force: true })
    }
    await card.getByRole("button", { name: "Reset" }).click()
    await expect(card, `${name} renders`).toBeVisible()
  }

  expect(errors).toEqual([])
})
