import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant opens against its edge and closes without errors.
test("every kitchen sink variant opens against its edge and closes", async ({
  page,
  framework,
}) => {
  test.skip(
    !["react", "vue", "web"].includes(framework),
    "Composition frameworks only."
  )
  test.setTimeout(240_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text())
  )

  await page.goto(`/?fixture=drawer-kitchen-sink&framework=${framework}`)
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Nested drawers' triggers are inside closed drawers, so they aren't counted.
  const triggers = page.locator(
    '[data-slot="drawer-trigger"]:not([data-slot="drawer-content"] *, ui-drawer-content *)'
  )
  // The shell builds every card at once, then each card mounts its own root, so wait for one trigger per card.
  await expect(
    page.getByRole("heading", { name: "Drawer kitchen sink" })
  ).toBeVisible()
  const cards = await page.locator("article").count()
  expect(cards).toBeGreaterThan(50)
  await expect.poll(() => triggers.count()).toBe(cards)
  const open = page.locator('[role="dialog"][data-open]')

  for (let index = 0; index < cards; index++) {
    const trigger = triggers.nth(index)
    const name = `variant ${index}: ${await trigger.locator("xpath=ancestor::article/div[1]/div[1]").textContent()}`
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const drawer = open.first()
    await expect(drawer, name).toBeVisible()
    // At rest, its edge touches the edge it comes from and part of it shows.
    await expect
      .poll(
        () =>
          drawer.evaluate((el) => {
            // A scroll-snap drawer's effects follow its scroller's timeline, so they never finish.
            const running = el
              .getAnimations()
              .filter(
                (animation) =>
                  animation.playState === "running" &&
                  animation.timeline === document.timeline
              )
            if (el.hasAttribute("data-dragging")) {
              return "dragging"
            }
            if (running.length) {
              return `animating ${running.map((animation) => JSON.stringify({ keyframe: (animation.effect as KeyframeEffect).getKeyframes()[0], timing: animation.effect?.getComputedTiming(), current: animation.currentTime, start: animation.startTime, now: document.timeline.currentTime })).join(" ")}`
            }
            const { top, left, bottom, right } = el.getBoundingClientRect()
            const { innerWidth: width, innerHeight: height } = window
            const side = el.getAttribute("data-side")
            const shown = {
              bottom: bottom >= height - 1 && height - top > 20,
              top: top <= 1 && bottom > 20,
              left: left <= 1 && right > 20,
              right: right >= width - 1 && width - left > 20,
            }[side ?? ""]
            return shown
              ? "rests"
              : `${side} at ${Math.round(top)},${Math.round(left)}`
          }),
        { message: `${name} rests against its edge` }
      )
      .toBe("rests")
    // A drawer that isn't modal closes on Escape only with focus inside.
    await drawer.focus()
    await page.keyboard.press("Escape")
    // A drawer that isn't dismissible refuses Escape, so its Close part closes it.
    const refused = await expect(open)
      .toHaveCount(0, { timeout: 500 })
      .then(() => false)
      .catch(() => true)
    if (refused) {
      await drawer.getByRole("button", { name: "Close", exact: true }).click()
    }
    await expect(open, `${name} closes`).toHaveCount(0)
    // A drawer settling closed still covers the page and may cover the next trigger.
    await expect(
      page.locator('[data-slot="drawer-content"]:visible'),
      `${name} leaves`
    ).toHaveCount(0, {
      timeout: 3000,
    })
  }

  expect(errors).toEqual([])
})
