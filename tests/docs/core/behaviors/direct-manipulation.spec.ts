import { expect, test, type Locator, type Page } from "@playwright/test"
import { openBehaviors } from "./helpers"

// Presses the middle of an element and moves the pointer by dx, dy, without letting go.
async function press(page: Page, target: Locator, dx: number, dy: number, at = { x: 0.5, y: 0.5 }) {
  await target.scrollIntoViewIfNeeded()
  const box = (await target.boundingBox())!
  const x = box.x + box.width * at.x
  const y = box.y + box.height * at.y
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 10 })
}

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "direct-manipulation")
  await expect(page.locator("[data-example]")).toHaveCount(15)
  expect(errors).toEqual([])
})

test("move: a drag commits once on drop, and Alt with an arrow nudges", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  const lemon = page.getByLabel("Sticker 🍋")
  await press(page, lemon, 40, -20)
  await expect(page.getByText("🍋 at 120, 80")).toBeVisible()
  await page.mouse.up()
  await expect(page.getByText("🍋 at 160, 60")).toBeVisible()
  await lemon.focus()
  await page.keyboard.press("Alt+ArrowDown")
  await expect(page.getByText("🍋 at 160, 70")).toBeVisible()
})

test("resize: a corner drag resizes the box, and Escape puts it back", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  const frame = page.getByLabel("Frame")
  const corner = frame.locator('[data-slot="frame-handle"]').nth(4)
  await press(page, corner, 40, 20)
  await page.keyboard.press("Escape")
  await page.mouse.up()
  await expect(page.getByText("140 × 92 at 88, 48")).toBeVisible()
  await press(page, corner, 40, 20)
  await page.mouse.up()
  await expect(page.getByText("180 × 112 at 88, 48")).toBeVisible()
})

test("swipe actions: Left opens a row's actions, and a swipe shows them too", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  const list = page.getByRole("list", { name: "Messages" })
  const row = list.getByRole("listitem").first()
  await row.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(row).toHaveAttribute("data-open", "end")
  await page.keyboard.press("Escape")
  await expect(row).not.toHaveAttribute("data-open")
  const second = list.getByRole("listitem").nth(1)
  await press(page, second, -120, 0)
  await page.mouse.up()
  await expect(second).toHaveAttribute("data-open", "end")
  await second.getByRole("button", { name: "Delete" }).click()
  await expect(list.getByRole("listitem")).toHaveCount(2)
})

test("area: a press moves the thumb there, and arrows step it", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  const thumb = page.getByRole("slider", { name: "Mix" })
  const pad = thumb.locator("..")
  await pad.scrollIntoViewIfNeeded()
  const box = (await pad.boundingBox())!
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.75)
  await expect(page.getByText("Warmth 75, energy 25")).toBeVisible()
  await page.keyboard.press("ArrowUp")
  await expect(page.getByText("Warmth 75, energy 26")).toBeVisible()
})

test("spans: dragging a booking moves it by half hours, and a drag on empty space books", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const atlas = page.getByRole("group", { name: "Atlas" }).first()
  const standup = atlas.getByText("Standup")
  const width = (await atlas.boundingBox())!.width
  await press(page, standup, width / 8, 0, { x: 0.3, y: 0.5 })
  await page.mouse.up()
  await expect(atlas.getByText("Standup 10:30")).toBeVisible()
  const birch = page.getByRole("group", { name: "Birch" })
  await press(page, birch, width / 8, 0, { x: 0.05, y: 0.5 })
  await page.mouse.up()
  await expect(birch.getByText(/^New 9:/)).toBeVisible()
})

test("preview: pressing and sliding previews each font, and letting go keeps one", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  const group = page.getByRole("radiogroup", { name: "Font" })
  const serif = group.getByRole("radio", { name: "Serif" })
  const mono = group.getByRole("radio", { name: "Mono" })
  await serif.scrollIntoViewIfNeeded()
  const a = (await serif.boundingBox())!
  const b = (await mono.boundingBox())!
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
  await page.mouse.down()
  await expect(page.getByText("Previewing Serif")).toBeVisible()
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 })
  await expect(page.getByText("Previewing Mono")).toBeVisible()
  await page.mouse.up()
  await expect(page.getByText("Chosen: Mono")).toBeVisible()
  await expect(mono).toHaveAttribute("aria-checked", "true")
})

test("move group: selected notes move together, 20 pixels a nudge, and the pinned note stays", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const board = page.getByRole("listbox", { name: "Notes" })
  const plan = board.getByRole("option", { name: "Plan" })
  const draft = board.getByRole("option", { name: "Draft" })
  const ship = board.getByRole("option", { name: /Ship/ })
  await plan.scrollIntoViewIfNeeded()
  await plan.click()
  await page.keyboard.down("Shift")
  await draft.click()
  await ship.click({ force: true })
  await page.keyboard.up("Shift")
  await expect(draft).toHaveAttribute("aria-selected", "true")
  await press(page, draft, 40, 0)
  await page.mouse.up()
  await expect(page.getByText("Plan at 60, 20 · Draft at 160, 60")).toBeVisible()
  await expect(ship).toHaveCSS("left", "220px")
  await page.keyboard.press("Alt+ArrowDown")
  await expect(page.getByText("Plan at 60, 40 · Draft at 160, 80")).toBeVisible()
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText("Moved 2 notes.")
  await expect(ship).toHaveCSS("top", "100px")
})

test("move zoom: a drag follows the pointer at any zoom, and the buttons move from code", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  await page.getByRole("button", { name: "50%", exact: true }).click()
  const canvas = page.getByRole("group", { name: "Canvas" })
  await press(page, canvas.getByLabel("Circle"), 40, 0)
  await page.mouse.up()
  await expect(page.getByText("Circle at 120, 40")).toBeVisible()
  await page.locator('[data-slot="canvas-action"]', { hasText: "Center" }).click()
  await expect(page.getByText("Circle at 100, 60")).toBeVisible()
  await page.locator('[data-slot="canvas-action"]', { hasText: "Nudge right" }).click()
  await expect(page.getByText("Circle at 110, 60")).toBeVisible()
})

test("resize ratio: corners and edges keep 16:9 within the limits, and arrows move 16 pixels", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const corner = page.getByLabel("Bottom right handle")
  await press(page, corner, 64, 0)
  await page.mouse.up()
  await expect(page.getByText("224 × 126")).toBeVisible()
  await press(page, page.getByLabel("Right handle", { exact: true }), 200, 0)
  await page.mouse.up()
  await expect(page.getByText("256 × 144")).toBeVisible()
  await corner.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByText("240 × 135")).toBeVisible()
  await page.getByLabel("Keep 16:9").uncheck()
  await corner.focus()
  await page.keyboard.press("ArrowUp")
  await expect(page.getByText("240 × 119")).toBeVisible()
})

test("resize windows: the size follows a zoomed drag, Notes is locked, and the buttons resize Mail", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const mail = page.getByRole("group", { name: "Mail", exact: true })
  await press(page, mail.locator('[data-resize-handle="se"]'), 30, 15)
  await expect(page.getByText("Mail 200 × 120")).toBeVisible()
  await expect(mail).toHaveAttribute("data-resizing", "se")
  await page.mouse.up()
  await expect(mail).not.toHaveAttribute("data-resizing")
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText("Mail is 200 by 120.")
  const notes = page.getByRole("group", { name: "Notes", exact: true })
  await press(page, notes.locator('[data-resize-handle="se"]'), 30, 15)
  await expect(notes).not.toHaveAttribute("data-resizing")
  await page.mouse.up()
  await page.locator('[data-slot="desktop-action"]', { hasText: "Grow" }).click()
  await expect(page.getByText("Mail 240 × 160")).toBeVisible()
  await page.locator('[data-slot="desktop-action"]', { hasText: "Maximize" }).click()
  await expect(page.getByText("Mail 400 × 240")).toBeVisible()
})

test("swipe full: a long swipe archives, the pinned row stays, and Peek and Close work from code", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const list = page.getByRole("list", { name: "Mailbox" })
  const row = (text: string) => list.getByRole("listitem").filter({ hasText: text })
  await row("Flight to Lisbon").focus()
  await page.keyboard.press("ArrowRight")
  await expect(row("Flight to Lisbon")).toHaveAttribute("data-open", "start")
  await page.keyboard.press("Escape")
  await expect(row("Flight to Lisbon")).not.toHaveAttribute("data-open")
  await press(page, row("Pinned"), -120, 0)
  await page.mouse.up()
  await expect(row("Pinned")).not.toHaveAttribute("data-open")
  await press(page, row("Weekly digest"), -200, 0)
  await page.mouse.up()
  await expect(page.getByText("Archived Weekly digest")).toBeVisible()
  await expect(list.getByRole("listitem")).toHaveCount(2)
  await page.locator('[data-slot="mailbox-action"]', { hasText: "Peek" }).click()
  await expect(row("Flight to Lisbon")).toHaveAttribute("data-open", "end")
  await page.locator('[data-slot="mailbox-action"]', { hasText: "Close" }).click()
  await expect(row("Flight to Lisbon")).not.toHaveAttribute("data-open")
})

test("area color: the saved color changes when a drag ends, Reset sets it, and Lock stops changes", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const thumb = page.getByRole("slider", { name: "Color" })
  await expect(thumb).toHaveAttribute("aria-valuetext", "60% saturation, 80% brightness")
  const square = thumb.locator("..")
  const width = (await square.boundingBox())!.width
  await press(page, square, -width / 4, 0)
  await expect(thumb).toHaveAttribute("aria-valuetext", "25% saturation, 50% brightness")
  await expect(page.getByText("Saved 60% saturation, 80% brightness")).toBeVisible()
  await page.mouse.up()
  await expect(page.getByText("Saved 25% saturation, 50% brightness")).toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByText("Saved 26% saturation, 50% brightness")).toBeVisible()
  await page.locator('[data-slot="color-reset"]').click()
  await expect(thumb).toHaveAttribute("aria-valuetext", "60% saturation, 80% brightness")
  await page.getByLabel("Lock").check()
  await expect(thumb).toHaveAttribute("aria-disabled", "true")
  await press(page, square, -width / 4, 0)
  await page.mouse.up()
  await expect(thumb).toHaveAttribute("aria-valuetext", "60% saturation, 80% brightness")
})

test("spans week: overlaps share a day, a click books an hour, and drags move, resize within limits and scroll", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const day = (name: string) => page.getByRole("group", { name, exact: true })
  const gym = page.getByLabel(/^Gym, /)
  await gym.scrollIntoViewIfNeeded()
  await expect.poll(() => gym.evaluate((el) => el.style.width)).toBe("50%")
  const tue = (await day("Tue").boundingBox())!
  await page.mouse.move(tue.x + 10, tue.y + 30)
  await page.mouse.move(tue.x + 12, tue.y + 31)
  await expect(page.getByText("Pointer at 8:30")).toBeVisible()
  const wed = (await day("Wed").boundingBox())!
  await page.mouse.click(wed.x + wed.width / 2, wed.y + 15)
  await expect(page.getByLabel("New, Wed 8:00 to 9:00")).toBeVisible()
  await press(page, gym, 0, 60)
  await page.mouse.up()
  await expect(page.getByLabel("Gym, Mon 10:00 to 11:00")).toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByLabel("Gym, Tue 10:00 to 11:00")).toBeVisible()
  const call = page.getByLabel(/^Call, /)
  await press(page, call.locator('[data-span-edge="end"]'), 0, 120)
  await page.mouse.up()
  await expect(page.getByLabel("Call, Mon 9:30 to 12:30")).toBeVisible()
  await expect
    .poll(() => day("Mon").evaluate((el) => el.closest('[data-slot="spans-week-frame"]')!.scrollTop))
    .toBeGreaterThan(0)
})

test("spans edit: the buttons change Standup, noon is checked first, and a blur puts a drag back", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  await page.locator('[data-slot="room-action"]', { hasText: "Later" }).click()
  await expect(page.getByText("Standup 10:00–11:00")).toBeVisible()
  await page.locator('[data-slot="room-action"]', { hasText: "Longer" }).click()
  await expect(page.getByText("Standup 10:00–11:30")).toBeVisible()
  await page.locator('[data-slot="room-action"]', { hasText: "Book noon" }).click()
  await expect(page.getByText("Booked noon.")).toBeVisible()
  await expect(page.getByText("Lunch 12:00–13:00")).toBeVisible()
  await page.locator('[data-slot="room-action"]', { hasText: "Book noon" }).click()
  await expect(page.getByText("Noon is taken.")).toBeVisible()
  const atlas = page.getByRole("group", { name: "Atlas" }).last()
  const width = (await atlas.boundingBox())!.width
  const board = atlas.getByText(/^Board meeting/)
  await press(page, board, width / 8, 0)
  await expect(board).not.toHaveAttribute("data-dragging")
  await page.mouse.up()
  const standup = atlas.getByText(/^Standup/)
  await press(page, standup, width / 8, 0)
  await expect(standup).toHaveAttribute("data-dragging", "")
  await page.evaluate(() => window.dispatchEvent(new Event("blur")))
  await page.mouse.up()
  await expect(page.getByText("Standup 10:00–11:30")).toBeVisible()
  await page.locator('[data-slot="room-action"]', { hasText: "Delete" }).click()
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText("Standup is cancelled.")
  await expect(page.getByText(/Standup 10:00–/)).toHaveCount(0)
})

test("preview themes: hovering previews, Contrast previews as nothing, and arrows are read out", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const group = page.getByRole("radiogroup", { name: "Theme" })
  await group.getByRole("radio", { name: "Dark" }).hover()
  await expect(page.getByText("Showing Dark")).toBeVisible()
  await page.mouse.move(0, 0)
  await expect(page.getByText("Showing Light")).toBeVisible()
  await group.getByRole("radio", { name: /Contrast/ }).hover()
  await expect(page.getByText("Showing Light")).toBeVisible()
  await group.getByRole("radio", { name: "Sepia" }).click()
  await page.mouse.move(0, 0)
  await expect(page.getByText("Showing Sepia")).toBeVisible()
  await expect(group.getByRole("radio", { name: "Sepia" })).toHaveAttribute("aria-checked", "true")
  await page.keyboard.press("ArrowUp")
  await expect(page.getByText("Showing Dark")).toBeVisible()
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText(
    "Trying the Dark theme. Enter keeps it, Escape puts it back.",
  )
  await page.keyboard.press("Escape")
  await expect(page.getByText("Showing Sepia")).toBeVisible()
})

test("every option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "direct-manipulation")
  for (const label of [
    "MoveOptions",
    "ResizeOptions",
    "SwipeActionsOptions",
    "AreaOptions",
    "SpansOptions",
    "PreviewOptions",
  ]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const href = (await link.getAttribute("href"))!
      if (!href.startsWith("#")) continue
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
    }
  }
})
