import { expect, test } from "../fixtures"

// Presses Next and a page in every kitchen sink variant. The page is for
// manual testing, so this only proves every variant renders and responds
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

  await page.goto(`/?fixture=pagination-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([data-slot]))").count())
    .toBe(0)

  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const current = card.locator('[aria-current="page"]')
    const next = card.locator('[data-slot="pagination-next"]')
    await next.scrollIntoViewIfNeeded()
    const before = Number(await current.textContent())
    const atEnd = (await next.getAttribute("aria-disabled")) === "true"
    await next.click({ force: true })
    const after = atEnd || id === "cancel" ? before : before + 1
    await expect(current, id!).toHaveText(String(after))
  }

  // Controllers drive the pagination from outside.
  for (const control of await page
    .locator('[data-variant="controller"] [data-controller]')
    .all()) {
    await control.click()
  }
  await expect(
    page.locator('[data-variant="controller"] [aria-current="page"]')
  ).toHaveText("5")
  expect(errors).toEqual([])
})
