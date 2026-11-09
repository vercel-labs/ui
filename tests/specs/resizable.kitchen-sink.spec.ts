import { expect, test } from "../fixtures"

// Uses every kitchen sink variant once. The page is for manual testing, so this
// only proves every variant renders and responds to keys and drags without errors.
test("every resizable kitchen sink variant works", async ({
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

  await page.goto(`/?fixture=resizable-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const cards = page.locator("[data-variant]")
  await expect.poll(() => cards.count()).toBeGreaterThan(15)
  const count = await cards.count()
  // Each card mounts its own app, so wait for every handle to get its value.
  await expect
    .poll(() => page.locator("[role=separator][aria-valuenow]").count())
    .toBeGreaterThan(count)

  for (let index = 0; index < count; index++) {
    const card = cards.nth(index)
    const name = await card.getAttribute("data-variant")
    const handle = card.getByRole("separator").first()
    await card.scrollIntoViewIfNeeded()
    await expect(handle, `${name} renders`).toBeVisible()
    if ((await handle.getAttribute("tabindex")) === null) {
      continue
    }
    const vertical =
      (await handle.getAttribute("aria-orientation")) === "horizontal"
    await handle.focus()
    // Only the handle's own axis: the other arrow isn't the handle's, so
    // Chromium and WebKit on Linux scroll a scrolling box with it, and the
    // drag below would start outside the box.
    await page.keyboard.press(vertical ? "ArrowDown" : "ArrowRight")
    await expect(
      card.locator("[data-commit]"),
      `${name} completes a change`
    ).not.toHaveText("none")
    const box = (await handle.boundingBox())!
    // Near the handle's start, which stays in view inside a scrolling box.
    const point = {
      x: box.x + Math.min(box.width / 2, 12),
      y: box.y + Math.min(box.height / 2, 12),
    }
    await page.mouse.move(point.x, point.y)
    await page.mouse.down()
    await page.mouse.move(
      point.x - (vertical ? 0 : 20),
      point.y - (vertical ? 20 : 0),
      { steps: 4 }
    )
    await page.mouse.up()
    await expect(card.locator("[data-change]"), `${name} drags`).toContainText(
      "drag"
    )
    for (const action of await card.locator(".flex-wrap > button").all()) {
      await action.click()
    }
  }

  expect(errors).toEqual([])
})
