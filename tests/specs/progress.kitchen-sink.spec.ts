import { expect, test } from "../fixtures"

// Opens every progress kitchen sink variant, checks what its value reads, then
// steps the animated ones. The page is for
// manual testing, so this only proves every variant renders and responds
// without errors. Checks are soft, so one run lists every variant that misbehaves.
test("every progress kitchen sink variant renders its value", async ({
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

  await page.goto(`/?fixture=progress-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() =>
      page.locator("[data-variant]:not(:has([data-slot$='-root']))").count()
    )
    .toBe(0)

  // Intl separates numbers from units with no-break spaces.
  const normalize = (text: string | null) =>
    (text ?? "").replace(/\s/g, " ").trim()
  for (const card of await cards.all()) {
    const id = await card.getAttribute("data-variant")
    const root = card.locator("[data-slot$='-root']")
    const value = card.locator("[data-slot$='-value']")
    await card.scrollIntoViewIfNeeded()
    await expect.soft(root, `${id} renders`).toBeVisible()
    await expect.soft(root, `${id} has a name`).toHaveAccessibleName(/\S/)
    const text = await card.getAttribute("data-text")
    if (text !== null) {
      await expect
        .poll(async () => normalize(await value.textContent()), `${id} reads`)
        .toBe(text)
    } else {
      await expect.soft(value, `${id} shows a value`).not.toBeEmpty()
    }
  }

  // An indeterminate bar has no current value.
  const indeterminate = page.locator(
    '[data-variant="progress-indeterminate"] [role="progressbar"]'
  )
  await expect(indeterminate).toHaveAttribute("data-indeterminate", "")
  await expect(indeterminate).not.toHaveAttribute("aria-valuenow", /./)
  await expect(
    page.locator('[data-variant="format-value-label"] [role="progressbar"]')
  ).toHaveAttribute("aria-valuetext", "3 of 12 files")

  // The step buttons move the value and its status.
  const progress = page.locator('[data-variant="progress-steps"]')
  const bar = progress.getByRole("progressbar")
  await progress.scrollIntoViewIfNeeded()
  await progress.getByRole("button", { name: "advance +20" }).click()
  await expect(bar).toHaveAttribute("aria-valuenow", "20")
  await progress.getByRole("button", { name: "complete" }).click()
  await expect(bar).toHaveAttribute("data-complete", "")
  await progress.getByRole("button", { name: "indeterminate" }).click()
  await expect(bar).toHaveAttribute("data-indeterminate", "")
  await progress.getByRole("button", { name: "advance +20" }).click()
  await expect(bar).toHaveAttribute("aria-valuenow", "20")
  await expect(bar).toHaveAttribute("data-progressing", "")

  expect(errors).toEqual([])
})
