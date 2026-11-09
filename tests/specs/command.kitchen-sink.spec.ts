import { expect, test } from "../fixtures"

// Drives every kitchen sink variant. The page is for manual testing, so this
// only proves every list renders, highlights and filters without errors.
test("every kitchen sink variant responds", async ({ page, framework }) => {
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

  await page.goto(`/?fixture=command-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // The dialog's list is checked on its own, below.
  const inputs = page.locator(
    '[data-slot="command-input"]:not([data-variant="dialog"] [data-slot="command-input"])'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => inputs.count()).toBeGreaterThan(30)
  const count = await inputs.count()

  for (let index = 0; index < count; index++) {
    const input = inputs.nth(index)
    await input.scrollIntoViewIfNeeded()
    const name = await input.evaluate(
      (el) => el.closest<HTMLElement>("[data-variant]")?.dataset.variant ?? ""
    )
    await input.focus()
    await page.keyboard.press("ArrowDown")
    // The highlight is a command in the page, or there's none to highlight.
    const highlight = await input.evaluate((el) => {
      const id = el.getAttribute("aria-activedescendant")
      const list = document.getElementById(
        el.getAttribute("aria-controls") ?? ""
      )
      return {
        found: !!id && !!document.getElementById(id),
        // Filtered out commands stay in the page, hidden.
        empty: ![...(list?.querySelectorAll('[role="option"]') ?? [])].some(
          (option) => option.checkVisibility()
        ),
      }
    })
    expect(highlight.found || highlight.empty, `${name} highlights`).toBe(true)
    // Typing goes at the end of any text the field starts with. End doesn't move the caret on a Mac.
    await input.evaluate((el: HTMLInputElement) =>
      el.setSelectionRange(el.value.length, el.value.length)
    )
    await page.keyboard.type("a")
    await expect(input, `${name} filters`).toHaveValue(/a$/)
    await page.keyboard.press("Backspace")
  }

  // The palette opens with its shortcut, and Escape closes it.
  const dialog = page.locator('[data-slot="dialog-content"][data-open]')
  await page.locator("body").click({ position: { x: 1, y: 1 } })
  await page.keyboard.press("ControlOrMeta+k")
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('[data-slot="command-input"]')).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(dialog).toHaveCount(0)

  expect(errors).toEqual([])
})
