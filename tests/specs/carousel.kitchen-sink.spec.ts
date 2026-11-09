import { expect, test } from "../fixtures"

// Presses Next in every kitchen sink variant, then an indicator. The page is
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

  await page.goto(`/?fixture=carousel-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([data-slot]))").count())
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const selected = card.locator('[role="tab"][aria-selected="true"]')
    const next = card.locator('[data-slot="carousel-next"]')
    await next.scrollIntoViewIfNeeded()
    // The mouse over a rotating carousel pauses it, so the page holds while we read it.
    await card.getByRole("region").hover()
    await expect(selected, id!).toHaveCount(1)
    const before = Number(
      (await selected.getAttribute("aria-label"))?.replace("Slide ", "")
    )
    const atEnd = (await next.getAttribute("aria-disabled")) === "true"
    await next.click({ force: true })
    const after = atEnd || id === "cancel" ? before : before + 1
    await expect(selected, id!).toHaveAttribute("aria-label", `Slide ${after}`)
    if (id === "cancel") {
      continue
    }
    await card.getByRole("tab", { name: "Slide 1" }).click()
    await expect(selected, id!).toHaveAttribute("aria-label", "Slide 1")
  }

  // Controllers drive the carousel from outside.
  for (const control of await page
    .locator('[data-variant="controller"] [data-controller]')
    .all()) {
    await control.click()
  }
  await expect(
    page.locator(
      '[data-variant="controller"] [role="tab"][aria-selected="true"]'
    )
  ).toHaveAttribute("aria-label", "Slide 4")
  expect(errors).toEqual([])
})
