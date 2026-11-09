import { expect, test } from "../fixtures"

// Opens every menu of every menubar variant and moves through every toolbar.
// The page is for manual testing, so this only proves every variant renders
// and responds without errors.
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

  await page.goto(`/?fixture=menubar-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect(cards.first()).toBeVisible()
  // Each card mounts its own root, so wait for all of them.
  await expect
    .poll(() => page.locator("[data-variant]:not(:has([data-slot]))").count())
    .toBe(0)

  for (const card of await page.locator('[data-variant^="menubar"]').all()) {
    const id = await card.getAttribute("data-variant")
    const disabled = id === "menubar-disabled"
    for (const trigger of await card.getByRole("menuitem").all()) {
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click({ force: disabled })
      const menu = page.getByRole("menu", {
        name: (await trigger.textContent())!.trim(),
        exact: true,
      })
      if (disabled) {
        await expect(menu, `${id} stays closed`).toHaveCount(0)
        continue
      }
      await expect(menu, `${id} opens`).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(menu).toHaveCount(0)
    }
  }

  for (const card of await page.locator('[data-variant^="toolbar"]').all()) {
    const id = await card.getAttribute("data-variant")
    const toolbar = card.getByRole("toolbar")
    const stop = toolbar.locator('[tabindex="0"]')
    await expect(stop, `${id} has one tab stop`).toHaveCount(1)
    await stop.focus()
    const first = await stop.evaluate((el) => el.outerHTML)
    const key =
      id === "toolbar-vertical"
        ? "ArrowDown"
        : id === "toolbar-rtl"
          ? "ArrowLeft"
          : "ArrowRight"
    await page.keyboard.press(key)
    await expect(toolbar.locator(":focus"), `${id} moves`).toHaveCount(1)
    const moved = await page.evaluate(
      (html) => document.activeElement?.outerHTML !== html,
      first
    )
    expect(moved, `${id} left its first item`).toBe(true)
  }

  // Controllers drive their parts from outside.
  for (const control of await page.locator("[data-controller]").all()) {
    await control.click()
  }
  expect(errors).toEqual([])
})
