import { expect, test } from "../fixtures"

// Presses every trigger in every kitchen sink variant, then the buttons around
// them. The page is for manual testing, so this only proves every variant
// renders, opens and closes without errors.
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

  await page.goto(`/?fixture=collapsible-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const triggers = page.locator('[data-slot="collapsible-trigger"]')
  // Each card mounts its own root, so wait for all of them.
  await expect(page.locator("[data-variant]").first()).toBeVisible()
  await expect
    .poll(() =>
      page
        .locator('[data-variant]:not(:has([data-slot="collapsible-trigger"]))')
        .count()
    )
    .toBe(0)
  const settled = page.locator("[data-ending-style], [data-starting-style]")
  // `data-starting-style` lasts one frame, and the panel's height transition
  // runs on after it, moving whatever sits below. So the next press waits for
  // every animation to finish too, or it can land beside a trigger still moving.
  const settle = async () => {
    await expect(settled).toHaveCount(0)
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((animation) => animation.playState !== "running")
    )
  }

  // Opening a folder of the file tree mounts its folders right after its
  // trigger, so the count grows as the loop goes and reaches them too.
  let pressed = 0
  for (let index = 0; index < (await triggers.count()); index++) {
    const trigger = triggers.nth(index)
    // Centered, so the event log in the corner never covers it.
    await trigger.evaluate((el) => el.scrollIntoView({ block: "center" }))
    const label = `trigger ${index}: ${await trigger.textContent()}`
    const before = await trigger.getAttribute("aria-expanded")
    // Disabled triggers, and changes the variant cancels, stay as they are.
    const blocked = await trigger.evaluate((el) => {
      const cancels = el.closest<HTMLElement>("[data-cancels]")?.dataset.cancels
      const change =
        el.getAttribute("aria-expanded") === "true" ? "close" : "open"
      return el.getAttribute("aria-disabled") === "true" || cancels === change
    })
    await trigger.click({ force: true })
    pressed++
    const after = blocked ? before : before === "true" ? "false" : "true"
    await expect(trigger, label).toHaveAttribute("aria-expanded", after!)
    if (after === "true") {
      const panel = page.locator(
        `[id="${await trigger.getAttribute("aria-controls")}"]`
      )
      await expect(panel, label).toBeVisible()
    }
    // A panel animating in or out must settle before the next press moves the page.
    await settle()
  }
  // Every variant's trigger, and the file tree's folders.
  expect(pressed).toBeGreaterThan(await page.locator("[data-variant]").count())

  // The controller drives its collapsible from outside.
  const controller = page.locator('[data-variant="controller"]')
  const controlled = controller.locator('[data-slot="collapsible-trigger"]')
  const press = async (name: string) => {
    await controller.getByRole("button", { name, exact: true }).click()
    await settle()
  }
  await controller.scrollIntoViewIfNeeded()
  const start = await controlled.getAttribute("aria-expanded")
  await press(start === "true" ? "close()" : "open()")
  await expect(controlled).toHaveAttribute(
    "aria-expanded",
    start === "true" ? "false" : "true"
  )
  await press("close()")
  await expect(controlled).toHaveAttribute("aria-expanded", "false")
  await press("toggle()")
  await expect(controlled).toHaveAttribute("aria-expanded", "true")
  await press("setOpen(true)")
  await expect(controlled).toHaveAttribute("aria-expanded", "true")
  await press("isOpen()")
  await press("focus()")
  await expect(controlled).toBeFocused()

  // The controlled variant follows the buttons that set its prop.
  const external = page.locator('[data-variant="controlled"]')
  const externalTrigger = external.locator('[data-slot="collapsible-trigger"]')
  await external.scrollIntoViewIfNeeded()
  for (const [name, expanded] of [
    ["Open", "true"],
    ["Close", "false"],
    ["Toggle", "true"],
    ["Toggle", "false"],
  ]) {
    await external.getByRole("button", { name, exact: true }).click()
    await expect(externalTrigger).toHaveAttribute("aria-expanded", expanded)
    await settle()
  }

  // Content added while open grows the panel. The loop left it open.
  const grow = page.locator('[data-variant="grow"]')
  const growPanel = grow.locator('[data-slot="collapsible-panel"]')
  await expect(
    grow.locator('[data-slot="collapsible-trigger"]')
  ).toHaveAttribute("aria-expanded", "true")
  const height = (await growPanel.boundingBox())!.height
  await grow.getByRole("button", { name: "Add a line" }).click()
  await grow.getByRole("button", { name: "Add a line" }).click()
  await expect(grow.getByText("Line 3")).toBeVisible()
  await expect
    .poll(async () => (await growPanel.boundingBox())!.height)
    .toBeGreaterThan(height)

  expect(errors).toEqual([])
})
