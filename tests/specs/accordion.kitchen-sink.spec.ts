import { expect, test } from "../fixtures"

// Presses every trigger in every kitchen sink variant. The page is for manual
// testing, so this only proves every variant renders, opens and closes without errors.
test("every kitchen sink variant opens and closes", async ({
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

  await page.goto(`/?fixture=accordion-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Nested accordions' triggers are inside closed panels, so they aren't counted.
  const triggers = page.locator(
    '[data-slot="accordion-trigger"]:not([data-slot="accordion-panel"] *, ui-accordion-panel *)'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(90)
  const count = await triggers.count()

  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    // Centered, so the event log in the corner never covers it.
    await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const label = `trigger ${index}: ${await trigger.textContent()}`
    const before = await trigger.getAttribute("aria-expanded")
    // Disabled triggers, and items whose opening the variant cancels, stay as they are.
    const blocked = await trigger.evaluate((el) => {
      const cancels = el.closest<HTMLElement>("[data-cancels]")?.dataset.cancels
      return (
        el.getAttribute("aria-disabled") === "true" ||
        (!!cancels && el.id.endsWith(`-trigger-${cancels}`))
      )
    })
    await trigger.click({ force: true })
    const after = blocked ? before : before === "true" ? "false" : "true"
    await expect(trigger, label).toHaveAttribute("aria-expanded", after!)
    if (after === "true") {
      const panel = page.locator(
        `[id="${await trigger.getAttribute("aria-controls")}"]`
      )
      await expect(panel, label).toBeVisible()
    }
    // A panel animating in or out must settle before the next press moves the page.
    await expect(
      page.locator("[data-ending-style], [data-starting-style]")
    ).toHaveCount(0)
  }

  const settled = page.locator("[data-ending-style], [data-starting-style]")

  // Expand all and Collapse all go through the controller's openAll() and closeAll().
  const expandAll = page.locator('[data-variant="expand-all"]')
  const expandTriggers = expandAll.locator('[data-slot="accordion-trigger"]')
  await expandAll.scrollIntoViewIfNeeded()
  await expandAll.getByRole("button", { name: "Expand all" }).click()
  await expect(
    expandTriggers.and(page.locator('[aria-expanded="true"]'))
  ).toHaveCount(await expandTriggers.count())
  await expect(settled).toHaveCount(0)
  await expandAll.getByRole("button", { name: "Collapse all" }).click()
  await expect(
    expandTriggers.and(page.locator('[aria-expanded="true"]'))
  ).toHaveCount(0)
  await expect(settled).toHaveCount(0)

  // Content added while open grows the second item's panel.
  const grow = page.locator('[data-variant="grow"]')
  const growTrigger = grow.locator('[data-slot="accordion-trigger"]').nth(1)
  await grow.scrollIntoViewIfNeeded()
  if ((await growTrigger.getAttribute("aria-expanded")) !== "true") {
    await growTrigger.click()
  }
  await expect(settled).toHaveCount(0)
  const growPanel = page.locator(
    `[id="${await growTrigger.getAttribute("aria-controls")}"]`
  )
  const height = (await growPanel.boundingBox())!.height
  await grow.getByRole("button", { name: "Add a line" }).click()
  await grow.getByRole("button", { name: "Add a line" }).click()
  await expect(grow.getByText("Line 3")).toBeVisible()
  await expect
    .poll(async () => (await growPanel.boundingBox())!.height)
    .toBeGreaterThan(height)

  // Reordered items report their new positions.
  const indexed = page.locator('[data-variant="index"]')
  await indexed.scrollIntoViewIfNeeded()
  const items = indexed.locator('[data-slot="accordion-item"]')
  const first = await items.nth(0).textContent()
  await indexed.getByRole("button", { name: "Reverse items" }).click()
  await expect(items.nth(0)).not.toHaveText(first!)
  for (let index = 0; index < (await items.count()); index++) {
    await expect(items.nth(index)).toHaveAttribute("data-index", String(index))
  }

  expect(errors).toEqual([])
})
