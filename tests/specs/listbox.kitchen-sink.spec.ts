import { expect, test } from "../fixtures"

// Presses an option in every kitchen sink variant and walks it with the
// keyboard. The page is for manual testing, so this only proves every variant
// renders and responds without errors.
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

  await page.goto(`/?fixture=listbox-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() =>
      page.locator("[data-variant]:not(:has([role=listbox]))").count()
    )
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const listbox = card.getByRole("listbox")
    await expect(listbox, `${id} is named`).toHaveAccessibleName("Toppings")
    const options = listbox.getByRole("option")
    expect(await options.count(), `${id} has options`).toBeGreaterThan(0)
    const blocked = await listbox.evaluate(
      (el, cancels) =>
        el.hasAttribute("data-disabled") ||
        el.hasAttribute("data-readonly") ||
        cancels,
      (await card.getAttribute("data-cancels")) !== null
    )
    const target = options.nth(1)
    await target.scrollIntoViewIfNeeded()
    const before = await target.getAttribute("aria-selected")
    await target.click({ force: true })
    // Links follow themselves, which only changes the hash.
    if (!blocked && before === "false") {
      await expect(target, `${id} selects`).toHaveAttribute(
        "aria-selected",
        "true"
      )
    }
    if (blocked) {
      await expect(target, `${id} stays`).toHaveAttribute(
        "aria-selected",
        before!
      )
    }
    if (!blocked) {
      await page.keyboard.press("Home")
      await expect(options.first(), `${id} moves focus`).toBeFocused()
    }
  }

  // Controllers drive their listbox from outside.
  for (const control of await page
    .locator('[data-variant="controller"] [data-controller]')
    .all()) {
    await control.click()
  }

  // The long list starts scrolled to its selection.
  await expect(
    page
      .locator('[data-variant="long"]')
      .getByRole("option", { name: "Topping 320" })
  ).toBeAttached()
  expect(errors).toEqual([])
})
