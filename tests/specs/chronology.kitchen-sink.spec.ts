import { expect, test } from "../fixtures"

// Moves through every kitchen sink variant with its arrow key. The page is for
// manual testing, so this only proves every variant renders and responds
// without errors.
test("every chronology kitchen sink variant renders and responds", async ({
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

  await page.goto(`/?fixture=chronology-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() =>
      page
        .locator("[data-variant]:not(:has([data-slot='chronology-item']))")
        .count()
    )
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const root = card.locator("[data-slot='chronology-root']")
    const items = card.locator("[data-slot='chronology-item']")
    const stop = card.locator("[data-slot='chronology-item'][tabindex='0']")
    await expect(stop, `${id} has one tab stop`).toHaveCount(1)
    await stop.focus()
    const before = await stop
      .locator("[data-slot='chronology-title']")
      .textContent()
    const horizontal =
      (await root.getAttribute("data-orientation")) === "horizontal"
    const next = horizontal
      ? id === "rtl"
        ? "ArrowLeft"
        : "ArrowRight"
      : "ArrowDown"
    await page.keyboard.press(id?.startsWith("feed") ? "PageDown" : next)
    const moved = (await items.count()) > 1
    const focused = () =>
      page.evaluate(
        () =>
          document.activeElement?.querySelector(
            "[data-slot='chronology-title']"
          )?.textContent
      )
    if (moved) {
      await expect.poll(focused, `${id} moves`).not.toBe(before)
    } else {
      await expect.poll(focused, `${id} stays`).toBe(before)
    }
  }

  for (const control of await page
    .locator('[data-variant="controller"] [data-controller]')
    .all()) {
    await control.click()
  }
  await expect(
    page
      .locator('[data-variant="controller"]')
      .getByRole("listitem", { name: "Shipped" })
  ).toBeFocused()

  const details = page.locator('[data-variant="details"]')
  await details.getByRole("button", { name: "Details" }).first().click()
  await expect(
    details.getByText("Handled by the order placed team.")
  ).toBeVisible()
  expect(errors).toEqual([])
})
