import { expect, test } from "../fixtures"

// Presses every toggle in every kitchen sink variant. The page is for manual
// testing, so this only proves every variant renders and responds without errors.
test("every kitchen sink variant renders and responds", async ({
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

  await page.goto(
    `/?fixture=password-input-kitchen-sink&framework=${framework}`
  )
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([data-slot]))").count())
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const toggle = card.getByRole("button", { name: "Show password" })
    const field = card.locator('[data-slot="password-input-control"]')
    await toggle.scrollIntoViewIfNeeded()
    const before = await field.getAttribute("type")
    const blocked =
      (await toggle.getAttribute("data-disabled")) !== null || id === "cancel"
    await toggle.click({ force: true })
    const after = blocked ? before : before === "password" ? "text" : "password"
    await expect(field, id!).toHaveAttribute("type", after!)
  }

  // A default value fills the field, on web components too.
  await expect(
    page.locator('[data-variant="default-value"] input')
  ).toHaveValue("hunter22")

  // Submitting hides the shown password.
  const form = page.locator('[data-variant="form"]')
  await form.locator("input").fill("hunter22")
  await form.getByRole("button", { name: "Submit" }).click()
  await expect(
    form.locator('[data-slot="password-input-control"]')
  ).toHaveAttribute("type", "password")

  // Controllers drive the field from outside.
  for (const control of await page
    .locator('[data-variant="controller"] [data-controller]')
    .all()) {
    await control.click()
  }
  expect(errors).toEqual([])
})
