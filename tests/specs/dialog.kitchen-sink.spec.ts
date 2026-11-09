import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, takes focus where it should, and closes
// without errors.
test("every kitchen sink variant opens and closes", async ({
  page,
  framework,
}) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  test.setTimeout(90_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )

  await page.goto(`/?fixture=dialog-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Nested dialogs' triggers are inside closed dialogs, so they aren't counted.
  const triggers = page.locator(
    ':is([data-slot="dialog-trigger"], [data-slot="alert-dialog-trigger"]):not([data-slot$="dialog-content"] *, ui-dialog-content *)'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(25)
  const count = await triggers.count()
  const open = page.locator(
    ':is([role="dialog"], [role="alertdialog"])[data-open]'
  )

  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    const name = await trigger.textContent()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    await expect(open.first(), `variant ${index}: ${name}`).toBeVisible()
    // A non-modal dialog closes on Escape only with focus inside, and one variant moves none in.
    await open.first().focus()
    await page.keyboard.press("Escape")
    // A dialog that isn't dismissible refuses Escape, so its Close part closes it.
    const refused = await expect(open)
      .toHaveCount(0, { timeout: 500 })
      .then(() => false)
      .catch(() => true)
    if (refused) {
      await open
        .first()
        .getByRole("button", { name: /^(Close|Cancel)$/ })
        .click()
    }
    await expect(open, `variant ${index} closes`).toHaveCount(0)
    // A dialog animating out still swallows presses that land on it, and it may cover the next trigger.
    await expect(page.locator("[data-ending-style]")).toHaveCount(0, {
      timeout: 3000,
    })
  }

  expect(errors).toEqual([])
})
