import type { Locator, Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Opens every kitchen sink variant. The page is for manual testing, so this
// only proves every variant renders, positions and closes without errors.

// Tooltips stay in the page while closed, hidden, so only open ones count.
const openTooltips = (page: Page) => page.locator('[role="tooltip"][data-open]')

// Moves the pointer somewhere empty, in the header.
const moveAway = (page: Page) => page.mouse.move(5, 5)

// Focuses the trigger with the keyboard, so it counts as keyboard focus.
async function tabTo(
  trigger: Locator,
  tab: (options?: { shift?: boolean }) => Promise<void>
) {
  await trigger.focus()
  await tab({ shift: true })
  await tab()
  await expect(trigger).toBeFocused()
}

async function expectPositioned(tooltip: Locator, label: string) {
  await expect(tooltip, label).toBeVisible()
  await expect(tooltip, label).toHaveAttribute(
    "data-side",
    /top|right|bottom|left/
  )
}

// A popup animating out may cover the next trigger.
async function expectClosed(page: Page, label: string) {
  await expect(openTooltips(page), `${label} closes`).toHaveCount(0)
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
  // Fake timers, so the checks that a variant stays closed run the time ahead.
  await page.clock.install()
  await page.goto(
    `/?fixture=tooltip-kitchen-sink&framework=${framework}&delay=50`
  )
  await page.locator("body[data-mounted]").waitFor({ state: "attached" })
  // Triggers inside closed popovers are tested on their own below.
  const triggers = page.locator(
    '[data-slot="tooltip-trigger"]:not([data-slot="popover-content"] *, ui-popover-content *)'
  )
  // Each card mounts its own root, so wait for all of them.
  await expect.poll(() => triggers.count()).toBeGreaterThan(55)
  const count = await triggers.count()

  // The defaultOpen variant is open from the start.
  await expect(openTooltips(page)).toHaveCount(1)
  await expect(openTooltips(page)).toHaveText("defaultOpen")
  await page.keyboard.press("Escape")
  await expectClosed(page, "defaultOpen")

  for (let index = 0; index < count; index++) {
    const trigger = triggers.nth(index)
    const id = await trigger.evaluate(
      (el) => el.closest<HTMLElement>("[data-variant]")!.dataset.variant!
    )
    const label = `variant ${index} (${id})`
    await trigger.scrollIntoViewIfNeeded()
    const tooltip = openTooltips(page).first()

    if (id === "disabled") {
      await trigger.hover()
      await page.clock.runFor(300)
      await expect(openTooltips(page), `${label} stays closed`).toHaveCount(0)
      await moveAway(page)
      continue
    }

    // Every third variant opens from the keyboard, unless it's about presses.
    const pressed = [
      "toggleable",
      "close-on-press",
      "close-on-press-false",
    ].includes(id)
    const keyboard = index % 3 === 2 && !pressed
    if (keyboard) {
      await tabTo(trigger, tab)
    } else {
      await trigger.hover()
    }
    await expectPositioned(tooltip, label)

    if (id === "toggleable") {
      // A press on a tooltip the pointer opened keeps it open, and the next closes it.
      await trigger.click()
      await page.clock.runFor(100)
      await expect(openTooltips(page), `${label} stays open`).toHaveCount(1)
      await trigger.click()
      await expectClosed(page, label)
      await trigger.click()
      await expectPositioned(tooltip, `${label} opens on press`)
    }
    if (id === "close-on-press") {
      await trigger.click()
      await expectClosed(page, label)
      await moveAway(page)
      continue
    }
    if (id === "close-on-press-false") {
      await trigger.click()
      await expect(tooltip, `${label} stays open`).toHaveText("Copied")
    }
    if (id === "controller") {
      await expect(tooltip).toHaveText(`Open ${await trigger.textContent()}`)
    }

    // What the keyboard or a press opened, Escape closes. What the pointer opened closes as it leaves, or on Escape.
    if (keyboard || pressed || index % 2) {
      await page.keyboard.press("Escape")
    } else {
      await moveAway(page)
    }
    await expectClosed(page, label)
    await moveAway(page)
  }

  // A tooltip on a popover's trigger: hover shows it, and pressing opens the popover and closes it.
  const profile = page
    .locator('[data-variant="popover-trigger"] button')
    .first()
  await profile.scrollIntoViewIfNeeded()
  await profile.hover()
  await expectPositioned(openTooltips(page).first(), "popover trigger")
  await profile.click()
  await expect(
    page.getByRole("dialog", { name: "Profile settings" })
  ).toBeVisible()
  await expect(openTooltips(page)).toHaveCount(0)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expectClosed(page, "popover trigger")

  // A tooltip inside a popover: Escape closes the tooltip, then the popover.
  await moveAway(page)
  await page.locator('[data-variant="in-popover"] button').first().click()
  const popover = page.getByRole("dialog", { name: "Formatting" })
  await expect(popover).toBeVisible()
  await popover.getByRole("button", { name: "Help" }).hover()
  await expectPositioned(openTooltips(page).first(), "in popover")
  await page.keyboard.press("Escape")
  await expect(openTooltips(page)).toHaveCount(0)
  await expect(popover).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(popover).toBeHidden()
  await expectClosed(page, "in popover")

  // The controller opens the shared tooltip with its own payload.
  await moveAway(page)
  const controls = page.locator("article", {
    has: page.locator('[data-variant="controller"]'),
  })
  await controls.getByRole("button", { name: "Open", exact: true }).click()
  await expect(openTooltips(page)).toHaveText("Open the Open button")
  await expectPositioned(openTooltips(page).first(), "controller open")
  await controls.getByRole("button", { name: "Close", exact: true }).click()
  await expectClosed(page, "controller close")

  expect(errors).toEqual([])
})
