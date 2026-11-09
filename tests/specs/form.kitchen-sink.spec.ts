import { expect, test } from "../fixtures"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders, takes text, submits and resets without errors.
test("every text field kitchen sink variant works", async ({
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

  await page.goto(`/?fixture=form-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(25)
  // Each card mounts its own app, so wait for every field.
  await expect.poll(() => page.getByRole("textbox").count()).toBeGreaterThan(25)

  for (let index = 0; index < (await cards.count()); index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const field = card.getByRole("textbox").first()
    await field.scrollIntoViewIfNeeded()
    if (
      (await field.isEditable()) &&
      (await field.getAttribute("type")) !== "email"
    ) {
      await field.fill("Ada")
    }
    await card.getByRole("button", { name: "Submit" }).click()
    await card.getByRole("button", { name: "Reset" }).click()
    await expect(card, `${name} renders`).toBeVisible()
  }

  expect(errors).toEqual([])
})

// A legend that isn't a native <legend>, like <ui-field-legend> on the web,
// still names its field set.
test("a field set's legend rendered as another element names the group", async ({
  page,
  framework,
}) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  await page.goto(`/?fixture=form-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const card = page.locator('[data-variant="field-set-legend-div"]')
  await expect(card.getByRole("group", { name: "Address" })).toBeVisible()
})
