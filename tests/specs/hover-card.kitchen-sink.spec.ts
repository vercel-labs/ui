import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, positions and closes without errors.

const openCards = (page: Page) =>
  page.locator('[data-slot="hover-card-content"][data-open]')

// Moves the pointer somewhere empty, in the header.
const moveAway = (page: Page) => page.mouse.move(5, 5)

async function expectPositioned(card: Locator, label: string) {
  await expect(card, label).toBeVisible()
  await expect(card, label).toHaveAttribute(
    "data-side",
    /top|right|bottom|left/
  )
}

// A popup animating out may cover the next trigger.
async function expectClosed(page: Page, label: string) {
  await expect(openCards(page), `${label} closes`).toHaveCount(0)
  await expect(page.locator("[data-ending-style]")).toHaveCount(0)
}

test("every kitchen sink variant opens", async ({ page, framework, tab }) => {
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

  // ?delay=50 keeps variants that don't test the delay from waiting 600ms each.
  // Fake timers, so the check that a disabled card stays closed runs the time ahead.
  await page.clock.install()
  await page.goto(
    `/?fixture=hover-card-kitchen-sink&framework=${framework}&delay=50`
  )
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  const triggers = page.locator('[data-slot="hover-card-trigger"]')
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(45)
  const count = await triggers.count()

  // The defaultOpen variant is open from the start.
  await expect(openCards(page)).toHaveCount(1)
  await expect(openCards(page)).toContainText("default-open")
  await page.keyboard.press("Escape")
  await expectClosed(page, "defaultOpen")

  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    const id = await trigger.evaluate(
      (el) => el.closest<HTMLElement>("[data-variant]")!.dataset.variant!
    )
    const label = `variant ${index} (${id})`
    await trigger.scrollIntoViewIfNeeded()

    if (id === "disabled") {
      await trigger.hover()
      await page.clock.runFor(300)
      await expect(openCards(page), `${label} stays closed`).toHaveCount(0)
      await moveAway(page)
      continue
    }

    await trigger.hover()
    const card = openCards(page).first()
    await expectPositioned(card, label)
    if (id === "controller") {
      await expect(card).toContainText((await trigger.textContent())!)
    }

    // Escape closes it, and so does the pointer leaving, after closeDelay.
    if (index % 2) {
      await page.keyboard.press("Escape")
    } else {
      await moveAway(page)
    }
    await expectClosed(page, label)
    await moveAway(page)

    if (id === "keep-mounted") {
      await expect(
        page.locator(
          '[data-variant="keep-mounted"] [data-slot="hover-card-content"]'
        ),
        `${label} stays mounted`
      ).toBeHidden()
    }
  }

  // Tab from the link moves into a card with something to focus.
  const profile = page.locator('[data-variant="profile"] a').first()
  await profile.scrollIntoViewIfNeeded()
  await profile.focus()
  await tab({ shift: true })
  await tab()
  await expectPositioned(openCards(page).first(), "profile from the keyboard")
  await tab()
  await expect(
    openCards(page).getByRole("link", { name: "View profile" })
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expectClosed(page, "profile from the keyboard")

  // A tooltip inside the card opens without closing it.
  const host = page.locator('[data-variant="tooltip"] a').first()
  await host.scrollIntoViewIfNeeded()
  await host.hover()
  await expectPositioned(openCards(page).first(), "tooltip host")
  await openCards(page).getByRole("button", { name: "Follow" }).hover()
  await expect(page.locator('[role="tooltip"][data-open]')).toBeVisible()
  await expect(openCards(page)).toHaveCount(1)
  await moveAway(page)
  await expectClosed(page, "tooltip host")
  await expect(page.locator('[role="tooltip"][data-open]')).toHaveCount(0)

  // The controller opens the shared card with its own payload.
  const controls = page.locator("article", {
    has: page.locator('[data-variant="controller"]'),
  })
  await controls.getByRole("button", { name: "Open", exact: true }).click()
  await expectPositioned(openCards(page).first(), "controller open")
  await expect(openCards(page)).toContainText("the Open button")
  await controls.getByRole("button", { name: "Close", exact: true }).click()
  await expectClosed(page, "controller close")

  expect(errors).toEqual([])
})
