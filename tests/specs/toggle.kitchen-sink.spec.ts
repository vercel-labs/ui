import { expect, test } from "../fixtures"

// Presses every toggle and button in every kitchen sink variant. The page is
// for manual testing, so this only proves every variant renders and responds
// without errors.
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

  await page.goto(`/?fixture=toggle-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([data-slot]))").count())
    .toBe(0)

  const toggles = page.locator('[data-slot="toggle"]')
  for (let index = 0; index < (await toggles.count()); index++) {
    const toggle = toggles.nth(index)
    await toggle.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const label = `toggle ${index} in ${await toggle.evaluate((el) => el.closest<HTMLElement>("[data-variant]")!.dataset.variant)}`
    const before = await toggle.getAttribute("aria-pressed")
    const blocked = await toggle.evaluate((el) => {
      const variant = el.closest<HTMLElement>("[data-variant]")!
      // A pressed toggle that can't be unpressed, a disabled one and a canceled change stay as they are.
      const locked =
        variant.dataset.variant === "group-not-deselectable" &&
        el.getAttribute("aria-pressed") === "true"
      return (
        el.hasAttribute("data-disabled") ||
        "cancels" in variant.dataset ||
        locked
      )
    })
    await toggle.click({ force: true })
    const after = blocked ? before : before === "true" ? "false" : "true"
    await expect(toggle, label).toHaveAttribute("aria-pressed", after!)
  }

  // Pending buttons settle, and every button press stays error free.
  for (const id of [
    "button",
    "button-pending",
    "button-reject",
    "button-submit",
    "button-span",
  ]) {
    const button = page.locator(`[data-variant="${id}"] [data-slot="button"]`)
    await button.scrollIntoViewIfNeeded()
    await button.click()
    if (id !== "button" && id !== "button-span") {
      await expect(button).toHaveAttribute("data-pending", "")
      await expect(button).not.toHaveAttribute("data-pending", "")
    }
  }

  // Controllers drive their parts from outside.
  for (const id of ["toggle-controller", "group-controller"]) {
    for (const control of await page
      .locator(`[data-variant="${id}"] [data-controller]`)
      .all()) {
      await control.click()
    }
  }
  await expect(
    page.locator('[data-variant="group-controller"] [aria-pressed="true"]')
  ).toHaveCount(3)

  await expect(
    page.locator('[data-variant="separator-decorative"] [role="separator"]')
  ).toHaveCount(0)
  expect(errors).toEqual([])
})
