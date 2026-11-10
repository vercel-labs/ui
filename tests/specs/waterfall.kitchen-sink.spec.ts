import { expect, test } from "../fixtures"

// Opens every waterfall kitchen sink variant, checks how many rows show and
// what the first bar says, then drives the controller and the keyboard. The
// page is for manual testing, so this only proves every variant renders and
// responds without errors. Checks are soft, so one run lists every variant that misbehaves.
test("every waterfall kitchen sink variant renders its rows", async ({
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

  await page.goto(`/?fixture=waterfall-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([role=row]))").count())
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const waterfall = card.getByRole("treegrid")
    const rows = waterfall.locator('[data-slot="waterfall-row"]:visible')
    await card.scrollIntoViewIfNeeded()
    await expect.soft(waterfall, `${id} has a name`).toHaveAccessibleName(/\S/)
    await expect
      .soft(rows, `${id} shows its rows`)
      .toHaveCount(Number(await card.getAttribute("data-rows")))
    await expect
      .soft(waterfall.locator('[tabindex="0"]'), `${id} has one tab stop`)
      .toHaveCount(1)
    const bar = await card.getAttribute("data-bar")
    if (bar !== null) {
      const label = rows
        .first()
        .locator('[data-slot="waterfall-bar"]')
        .getAttribute("aria-label")
      // Intl separates numbers from units with no-break spaces.
      expect.soft((await label)?.replace(/\s/g, " "), `${id} bar`).toBe(bar)
    }
  }

  const selected = page.locator('[data-variant="selected"]')
  await expect(selected.locator('[role="row"][tabindex="0"]')).toHaveAttribute(
    "aria-selected",
    "true"
  )

  const controller = page.locator('[data-variant="controller"]')
  const shown = controller.locator('[data-slot="waterfall-row"]:visible')
  await controller.scrollIntoViewIfNeeded()
  await controller.getByRole("button", { name: "expandAll()" }).click()
  await expect(shown).toHaveCount(6)
  await controller.getByRole("button", { name: "collapseAll()" }).click()
  await expect(shown).toHaveCount(2)
  await controller.getByRole("button", { name: "reveal('flags')" }).click()
  await expect(
    controller.getByRole("row", { name: /GET \/api\/flags/ })
  ).toBeFocused()

  // Right to left, Left expands a row.
  const rtl = page.locator('[data-variant="rtl"]')
  const app = rtl.getByRole("row", { name: /GET \/app\.js/ })
  await app.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(app).toHaveAttribute("aria-expanded", "true")
  await expect(rtl.locator('[data-slot="waterfall-row"]:visible')).toHaveCount(
    6
  )

  expect(errors).toEqual([])
})
