import { expect, type Locator } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

// The newest line in an example's console.
const lastLog = (example: Locator) =>
  example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "popups")
  await expect(page.locator("[data-example]")).toHaveCount(11)
  await expect(page.locator("figure > figcaption")).toHaveCount(11)
  expect(errors).toEqual([])
})

test("own popup: Escape, a press outside and Done each close it, and focus goes back", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const trigger = page.getByRole("button", { name: "Invite", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  const popover = page.getByRole("dialog", { name: "Invite" })
  await trigger.click()
  await expect(popover).toBeVisible()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await expect(popover).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await expect(popover).toBeVisible()
  const corner = (await page
    .locator('[data-example="behaviors/popup-own"]')
    .boundingBox())!
  await page.mouse.click(corner.x + 5, corner.y + 5)
  await expect(popover).toBeHidden()
  await trigger.click()
  await popover.getByRole("button", { name: "Done" }).click()
  await expect(popover).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("presets: a popover, a modal dialog and a tooltip from the same primitive", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const filters = page.getByRole("button", { name: "Filters", exact: true })
  await filters.scrollIntoViewIfNeeded()
  await filters.click()
  const panel = page.getByRole("dialog", { name: "Filters" })
  await expect(panel).toBeVisible()
  await expect(panel).not.toHaveAttribute("aria-modal", "true")
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Rename", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Rename file" })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute("aria-modal", "true")
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press("Tab")
  }
  expect(
    await dialog.evaluate((el) => el.contains(document.activeElement)),
    "focus stays inside while it's open"
  ).toBe(true)
  await dialog.getByRole("button", { name: "Save" }).click()
  await expect(dialog).toBeHidden()
  const help = page.getByRole("button", { name: "Help" })
  await help.hover()
  await expect(page.locator("[data-slot=help-content]")).toBeVisible()
  await expect(help).toHaveAccessibleDescription(/Filters narrow the list/)
})

test("options: reasons, modal, open on hover and refusing a dismissal", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const example = page.locator('[data-example="behaviors/popup-options"]')
  const cart = example.getByRole("button", { name: "Cart", exact: true })
  await cart.scrollIntoViewIfNeeded()
  const status = lastLog(example)
  const count = example.getByRole("button", { name: /^Likes/ })
  const content = page.getByRole("dialog", { name: "Cart" })
  await cart.click()
  await expect(status).toHaveText("Opened by trigger-press")
  await page.keyboard.press("Escape")
  await expect(status).toHaveText("Closed by escape-key")
  await cart.click()
  await count.click()
  await expect(status, "not modal: a press outside closes it").toHaveText(
    "Closed by outside-press"
  )
  await expect(
    count,
    "not modal: the press reaches the button beneath"
  ).toHaveText("Likes 1")
  await example.getByRole("checkbox", { name: "Modal" }).check()
  await cart.click()
  await expect(count).toHaveAttribute("inert", "")
  const box = (await count.boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect(content, "modal: the press closes it").toBeHidden()
  await expect(
    count,
    "modal: the press doesn't reach the button beneath"
  ).toHaveText("Likes 1")
  await example.getByRole("checkbox", { name: "Modal" }).uncheck()
  await example.getByRole("checkbox", { name: "Dismissible" }).uncheck()
  await cart.click()
  await page.keyboard.press("Escape")
  await expect(status).toHaveText("Kept open: escape-key")
  await expect(content).toBeVisible()
  await content.getByRole("button", { name: "Check Out" }).click()
  await expect(status).toHaveText("Closed by close-press")
  await expect(content).toBeHidden()
  await example.getByRole("checkbox", { name: "Dismissible" }).check()
  await example.getByRole("checkbox", { name: "Open on hover" }).check()
  await cart.hover()
  await expect(status).toHaveText("Opened by trigger-hover")
})

test("options: a press on a control under the cart as it fades out reaches the control", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const example = page.locator('[data-example="behaviors/popup-options"]')
  const cart = example.getByRole("button", { name: "Cart", exact: true })
  await cart.scrollIntoViewIfNeeded()
  const content = page.locator('[data-slot="cart-content"]')
  const modal = example.getByRole("checkbox", { name: "Modal" })
  await cart.click()
  const popup = (await content.boundingBox())!
  const box = (await modal.boundingBox())!
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2]
  const covered =
    x > popup.x &&
    x < popup.x + popup.width &&
    y > popup.y &&
    y < popup.y + popup.height
  expect(covered, "the cart covers the checkbox").toBe(true)
  await expect(content).toHaveCSS("opacity", "1")
  await page.addStyleTag({
    content:
      '[data-slot="cart-content"] { transition-duration: 10s !important; }',
  })
  await page.keyboard.press("Escape")
  await expect(content).toHaveAttribute("data-ending-style", "")
  await modal.check()
  await expect(content, "it's still fading out").toHaveAttribute(
    "data-ending-style",
    ""
  )
})

test("payload: every avatar opens the same card with its own person", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const hollis = page.getByRole("button", { name: "Hollis Grant" })
  await hollis.scrollIntoViewIfNeeded()
  await hollis.click()
  const card = page.getByRole("dialog", { name: "Hollis Grant" })
  await expect(card).toBeVisible()
  await expect(card).toHaveAccessibleDescription("Engineering")
  await expect(lastLog(hollis)).toHaveText("Hollis Grant, by trigger-press")
  await expect(card.locator("[data-slot=team-card-arrow]")).toHaveAttribute(
    "data-side",
    "bottom"
  )
  const ines = page.getByRole("button", { name: "Inès Moreau" })
  await ines.click()
  const moved = page.getByRole("dialog", { name: "Inès Moreau" })
  await expect(moved).toBeVisible()
  await expect(moved).toHaveAccessibleDescription("Design")
  const offset = async () => {
    const at = (await moved.boundingBox())!
    const from = (await ines.boundingBox())!
    return Math.abs(at.x + at.width / 2 - (from.x + from.width / 2))
  }
  await expect.poll(offset).toBeLessThan(2)
  await expect(lastLog(hollis)).toHaveText("Inès Moreau, by trigger-press")
})

test("link preview: resting on a link previews its page, with its image", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const link = page.getByRole("link", { name: "popup layer" })
  await link.scrollIntoViewIfNeeded()
  await link.hover()
  const preview = page.locator("[data-slot=link-preview-content]")
  await expect(preview).toBeVisible()
  await expect(preview).toContainText("The top layer, placement, presence")
  await expect(preview.locator("img")).toHaveCount(1)
  await page.getByRole("link", { name: "motion", exact: true }).hover()
  await expect(preview).toContainText("Presence and gesture physics")
  await expect(preview.locator("img")).toHaveCount(0)
})

test("compose: our Popover opens your picker, and a pick closes it", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const trigger = page.getByRole("button", { name: "React", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const picker = page.getByRole("dialog", { name: "React" })
  await expect(picker).toBeVisible()
  await picker.getByRole("button", { name: "🚀" }).click()
  await expect(picker).toBeHidden()
  await expect(lastLog(trigger)).toHaveText("Reacted with 🚀")
  await trigger.click()
  await page.keyboard.press("Escape")
  await expect(picker).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("position: the card opens at the press, and Escape closes it back to the map", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const map = page.getByRole("button", { name: "Map, press to drop a pin" })
  await map.scrollIntoViewIfNeeded()
  const box = (await map.boundingBox())!
  await page.mouse.click(box.x + 40, box.y + 30)
  const card = page.getByRole("dialog", { name: "Pin" })
  // Within a pixel: the page can scroll by a fraction.
  await expect(card).toContainText(/Pin at (39|40|41), (29|30|31)/)
  const at = (await card.boundingBox())!
  expect(Math.abs(at.x - (box.x + 40))).toBeLessThan(2)
  expect(Math.abs(at.y - (box.y + 34))).toBeLessThan(2)
  await page.keyboard.press("Escape")
  await expect(card).toBeHidden()
  await expect(map).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(card).toContainText("Pin at")
  await expect(card.getByRole("button", { name: "Done" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(card).toBeHidden()
  await expect(map).toBeFocused()
})

test("layer: Escape closes our menu first, then your panel", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const trigger = page.getByRole("button", { name: "Share", exact: true })
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const panel = page.getByRole("dialog", { name: "Share" })
  await expect(panel).toBeVisible()
  await panel.getByRole("button", { name: "Can view" }).click()
  const menu = page.getByRole("menu")
  await expect(menu).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(menu).toBeHidden()
  await expect(panel).toBeVisible()
  await panel.getByRole("button", { name: "Can view" }).click()
  await menu.getByRole("menuitem", { name: "Can edit" }).click()
  await expect(panel).toBeVisible()
  await expect(panel.getByRole("button", { name: "Can edit" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(panel).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("controller: open() places our Popover at the pointer, hands it a payload and says how it closed", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const card = page.getByRole("button", { name: "Card", exact: true })
  await card.scrollIntoViewIfNeeded()
  const box = (await card.boundingBox())!
  await page.mouse.click(box.x + 40, box.y + 30)
  const popover = page
    .locator('[data-slot="popover-content"]')
    .filter({ hasText: "A note at" })
  await expect(popover).toBeVisible()
  await expect(popover.locator("[data-spot]")).toHaveText(
    /A note at (39|40|41), (29|30|31)$/
  )
  const at = (await popover.boundingBox())!
  expect(Math.abs(at.x - (box.x + 40))).toBeLessThan(2)
  await page.keyboard.press("Escape")
  await expect(lastLog(card)).toHaveText("Closed by escape-key (keyboard)")
  await page.mouse.click(box.x + 60, box.y + 60)
  await popover.getByRole("button", { name: "Keep" }).click()
  await expect(lastLog(card)).toHaveText(/^Closed by imperative \(\w+\), kept$/)
  await page.getByRole("checkbox", { name: "Close by itself" }).check()
  await page.mouse.click(box.x + 60, box.y + 60)
  await expect(popover).toBeVisible()
  await expect(popover).toBeHidden({ timeout: 4000 })
  await expect(lastLog(card)).toHaveText(/^Closed by imperative/)
})

test("position options: the hint lands on the side asked, follows new options, and flips near the edge", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const target = page.locator('[data-slot="callout-target"]')
  const bubble = page.locator('[data-slot="callout-bubble"]')
  const arrow = page.locator('[data-slot="callout-arrow"]')
  await target.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, -200))
  await expect(bubble).toHaveAttribute("data-side", "top")
  await expect(bubble).toHaveAttribute("data-align", "center")
  await expect(arrow).toHaveAttribute("data-side", "top")
  const gap = async () =>
    (await target.boundingBox())!.y -
    ((await bubble.boundingBox())!.y + (await bubble.boundingBox())!.height)
  await expect.poll(async () => Math.round(await gap())).toBe(8)
  await page.getByLabel("sideOffset").fill("30")
  await expect.poll(async () => Math.round(await gap())).toBe(30)
  await page.getByRole("combobox", { name: /^Side/ }).selectOption("right")
  await expect(bubble).toHaveAttribute("data-side", "right")
  await page.getByRole("combobox", { name: /^Align/ }).selectOption("start")
  await expect(bubble).toHaveAttribute("data-align", "start")
  // With the button near the top of the window, a hint on top flips below.
  await page.getByRole("combobox", { name: /^Side/ }).selectOption("top")
  await page.getByLabel("sideOffset").fill("8")
  await target.evaluate((el) =>
    window.scrollBy(0, el.getBoundingClientRect().top - 20)
  )
  await expect(bubble).toHaveAttribute("data-side", "bottom")
  await target.click()
  await expect(bubble).toHaveCount(0)
})

test("modal layer: a press outside only closes it, the window blurring closes it, and the player stays usable", async ({
  page,
}) => {
  await openBehaviors(page, "popups")
  const example = page.locator('[data-example="behaviors/layer-modal"]')
  const trigger = page.locator('[data-slot="timer-trigger"]')
  const panel = page.locator('[data-slot="timer-panel"]')
  const counter = page.getByRole("button", { name: /^Count \d+$/ })
  const closed = lastLog(example)
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  await expect(panel).toBeVisible()
  // The player works over the panel, and doesn't close it.
  await page.getByRole("button", { name: "Pause" }).click()
  await expect(example.getByText("Paused")).toBeVisible()
  await expect(panel).toBeVisible()
  await counter.click()
  await expect(panel).toHaveCount(0)
  await expect(counter).toHaveText("Count 0")
  await expect(closed).toHaveText("Dismissed by outside-press")
  await example.getByRole("checkbox", { name: "Modal" }).uncheck()
  await trigger.click()
  await counter.click()
  await expect(panel).toHaveCount(0)
  await expect(counter).toHaveText("Count 1")
  await trigger.click()
  await page.locator('[data-slot="timer-done"]').click()
  await expect(closed).toHaveText("Closed by done-press")
  await trigger.click()
  await expect(panel).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event("blur")))
  await expect(panel).toHaveCount(0)
  await expect(closed).toHaveText("Dismissed by window-blur")
})

test("each option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "popups")
  for (const label of [
    "CreatePopupOptions",
    "PositionOptions",
    "BindLayerOptions",
  ]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const href = (await link.getAttribute("href"))!
      if (!href.startsWith("#")) {
        continue
      }
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
    }
  }
})
