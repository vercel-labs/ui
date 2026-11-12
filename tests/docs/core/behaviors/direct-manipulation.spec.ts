import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

// Presses the middle of an element and moves the pointer by dx, dy, without letting go.
async function press(
  page: Page,
  target: Locator,
  dx: number,
  dy: number,
  at = { x: 0.5, y: 0.5 }
) {
  await target.scrollIntoViewIfNeeded()
  const box = (await target.boundingBox())!
  const x = box.x + box.width * at.x
  const y = box.y + box.height * at.y
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 10 })
}

// The newest line in an example's console.
const lastLog = (example: Locator) =>
  example
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

const example = (page: Page, name: string) =>
  page.locator(`[data-example="behaviors/${name}"]`)

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "direct-manipulation")
  await expect(page.locator("[data-example]")).toHaveCount(19)
  expect(errors).toEqual([])
})

test("move: a drag commits once on drop, and Alt with an arrow nudges", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const lemon = page.getByLabel("Lemon", { exact: true })
  await press(page, lemon, 40, -20)
  await expect(lemon).toHaveCSS("left", "108px")
  await page.mouse.up()
  await expect(lastLog(example(page, "move"))).toHaveText(
    "Lemon moved to 148, 76 (drag)"
  )
  await lemon.focus()
  await page.keyboard.press("Alt+ArrowDown")
  await expect(lastLog(example(page, "move"))).toHaveText(
    "Lemon moved to 148, 80 (move-key)"
  )
})

test("resize: a corner drag resizes the box, and Escape puts it back", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const frame = page.getByLabel("Frame")
  const corner = frame.locator('[data-slot="frame-handle"]').nth(4)
  await press(page, corner, 40, 20)
  await page.keyboard.press("Escape")
  await page.mouse.up()
  await expect(frame).toHaveCSS("width", "136px")
  await press(page, corner, 40, 20)
  await page.mouse.up()
  await expect(lastLog(example(page, "resize"))).toHaveText(
    "176 × 116 at 68, 40 (drag)"
  )
})

test("swipe actions: Left opens a row's actions, and a swipe shows them too", async ({
  page,
}) => {
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

test("area: a press moves the thumb there, and arrows step it", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const thumb = page.getByRole("slider", { name: "Mix" })
  const pad = thumb.locator("..")
  await pad.scrollIntoViewIfNeeded()
  const box = (await pad.boundingBox())!
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height * 0.75)
  await expect(lastLog(example(page, "area"))).toHaveText(
    "Warmth 75, energy 25 (track-press)"
  )
  await page.keyboard.press("ArrowUp")
  await expect(lastLog(example(page, "area"))).toHaveText(
    "Warmth 75, energy 26 (step-key)"
  )
})

test("spans: dragging a booking moves it by half hours, and a drag on empty space books", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const atlas = page.getByRole("group", { name: "Atlas" }).first()
  const standup = atlas.getByLabel(/^Standup, /)
  const width = (await atlas.boundingBox())!.width
  await press(page, standup, width / 8, 0, { x: 0.3, y: 0.5 })
  await page.mouse.up()
  await expect(atlas.getByLabel("Standup, Atlas, 10:30 to 12:00")).toBeVisible()
  const birch = page.getByRole("group", { name: "Birch" })
  await press(page, birch, width / 8, 0, { x: 0.05, y: 0.5 })
  await page.mouse.up()
  await expect(birch.getByLabel(/^New, Birch, 9:/)).toBeVisible()
})

test("preview: pressing and sliding previews each font, and letting go keeps one", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const group = page.getByRole("radiogroup", { name: "Font" })
  const serif = group.getByRole("radio", { name: "Serif" })
  const mono = group.getByRole("radio", { name: "Mono" })
  await serif.scrollIntoViewIfNeeded()
  const a = (await serif.boundingBox())!
  const b = (await mono.boundingBox())!
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
  const font = () =>
    example(page, "preview")
      .locator('[data-slot="preview-sample"]')
      .evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--preview-font")
      )
  await page.mouse.down()
  await expect.poll(font).toContain("serif")
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 6 })
  await expect.poll(font).toContain("--mono")
  await page.mouse.up()
  await expect(lastLog(example(page, "preview"))).toHaveText("Chose Mono")
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
  await expect(lastLog(example(page, "move-group"))).toHaveText(
    "Draft moved to 140, 60"
  )
  await expect(plan).toHaveCSS("left", "60px")
  await expect(ship).toHaveCSS("left", "180px")
  await page.keyboard.press("Alt+ArrowDown")
  await expect(lastLog(example(page, "move-group"))).toHaveText(
    "Draft moved to 140, 80"
  )
  await expect(plan).toHaveCSS("top", "40px")
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText(
    "Moved 2 notes."
  )
  await expect(ship).toHaveCSS("top", "120px")
})

test("move zoom: a drag follows the pointer at any zoom, and the buttons move from code", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  await page.getByRole("button", { name: "50%", exact: true }).click()
  const canvas = page.getByRole("group", { name: "Canvas" })
  await press(page, canvas.getByLabel("Circle"), 40, 0)
  await page.mouse.up()
  const log = lastLog(example(page, "move-zoom"))
  await expect(log).toHaveText("Circle at 120, 40 · Square at 168, 88")
  await page
    .locator('[data-slot="canvas-action"]', { hasText: "Center" })
    .click()
  await expect(log).toHaveText("Circle at 112, 64 · Square at 168, 88")
  await page
    .locator('[data-slot="canvas-action"]', { hasText: "Nudge" })
    .click()
  await expect(log).toHaveText("Circle at 122, 64 · Square at 168, 88")
})

test("resize ratio: corners and edges keep 16:9 within the limits, and Shift with an arrow moves 16 pixels", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const ratio = example(page, "resize-ratio")
  const log = lastLog(ratio)
  await press(page, ratio.getByLabel("Video", { exact: true }), -56, -27)
  await page.mouse.up()
  const corner = ratio.getByLabel("Resize bottom right")
  await press(page, corner, 64, 0)
  await page.mouse.up()
  await expect(log).toHaveText("224 × 126")
  await press(page, ratio.getByLabel("Resize right", { exact: true }), 200, 0)
  await page.mouse.up()
  await expect(log).toHaveText("256 × 144")
  await corner.focus()
  await page.keyboard.press("Shift+ArrowLeft")
  await expect(log).toHaveText("240 × 135")
  await page.getByLabel("Keep 16:9").uncheck()
  await corner.focus()
  await page.keyboard.press("Shift+ArrowUp")
  await expect(log).toHaveText("240 × 119")
})

test("resize windows: the size follows a zoomed drag, Notes is locked, and the buttons resize Mail", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const mail = page.getByRole("group", { name: "Mail", exact: true })
  await press(page, mail.locator('[data-resize-handle="se"]'), 30, 15)
  await expect(mail.getByText("200 × 120")).toBeVisible()
  await expect(mail).toHaveAttribute("data-resizing", "se")
  await page.mouse.up()
  await expect(mail).not.toHaveAttribute("data-resizing")
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText(
    "Mail is 200 by 120."
  )
  const notes = page.getByRole("group", { name: "Notes", exact: true })
  await press(page, notes.locator('[data-resize-handle="se"]'), 30, 15)
  await expect(notes).not.toHaveAttribute("data-resizing")
  await page.mouse.up()
  await page
    .locator('[data-slot="desktop-action"]', { hasText: "Grow" })
    .click()
  await expect(mail.getByText("240 × 160")).toBeVisible()
  await page
    .locator('[data-slot="desktop-action"]', { hasText: "Maximize" })
    .click()
  await expect(mail.getByText("360 × 220")).toBeVisible()
})

test("swipe full: a long swipe archives, the pinned row stays, and Peek and Close work from code", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const list = page.getByRole("list", { name: "Mailbox" })
  const row = (text: string) =>
    list.getByRole("listitem").filter({ hasText: text })
  await row("Flight to Lisbon").focus()
  await page.keyboard.press("ArrowRight")
  await expect(row("Flight to Lisbon")).toHaveAttribute("data-open", "start")
  await page.keyboard.press("Escape")
  await expect(row("Flight to Lisbon")).not.toHaveAttribute("data-open")
  await press(page, row("Welcome to Acme"), -120, 0)
  await page.mouse.up()
  await expect(row("Welcome to Acme")).not.toHaveAttribute("data-open")
  await press(page, row("Weekly digest"), -200, 0)
  await page.mouse.up()
  await expect(lastLog(example(page, "swipe-full"))).toHaveText(
    "Archived: Weekly digest"
  )
  await expect(list.getByRole("listitem")).toHaveCount(2)
  await page
    .locator('[data-slot="mailbox-action"]', { hasText: "Peek" })
    .click()
  await expect(row("Flight to Lisbon")).toHaveAttribute("data-open", "end")
  await page
    .locator('[data-slot="mailbox-action"]', { hasText: "Close" })
    .click()
  await expect(row("Flight to Lisbon")).not.toHaveAttribute("data-open")
})

test("area color: the saved color changes when a drag ends, Reset sets it, and Lock stops changes", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const thumb = page.getByRole("slider", { name: "Color" })
  await expect(thumb).toHaveAttribute(
    "aria-valuetext",
    "60% saturation, 80% brightness"
  )
  const square = thumb.locator("..")
  const width = (await square.boundingBox())!.width
  await press(page, square, -width / 4, 0)
  await expect(thumb).toHaveAttribute(
    "aria-valuetext",
    "25% saturation, 50% brightness"
  )
  const log = lastLog(example(page, "area-color"))
  await expect(log).toHaveCount(0)
  await page.mouse.up()
  await expect(log).toHaveText("Saved 25% saturation, 50% brightness")
  await page.keyboard.press("ArrowRight")
  await expect(log).toHaveText("Saved 26% saturation, 50% brightness")
  await page.locator('[data-slot="color-reset"]').click()
  await expect(thumb).toHaveAttribute(
    "aria-valuetext",
    "60% saturation, 80% brightness"
  )
  await page.getByLabel("Lock").check()
  await expect(thumb).toHaveAttribute("aria-disabled", "true")
  await press(page, square, -width / 4, 0)
  await page.mouse.up()
  await expect(thumb).toHaveAttribute(
    "aria-valuetext",
    "60% saturation, 80% brightness"
  )
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
  await expect(lastLog(example(page, "spans-week"))).toHaveText(
    "Pointer at Tue 8:30"
  )
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
    .poll(() =>
      day("Mon").evaluate(
        (el) => el.closest('[data-slot="spans-week-frame"]')!.scrollTop
      )
    )
    .toBeGreaterThan(0)
})

test("spans edit: the buttons change Standup, noon is checked first, and a blur puts a drag back", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const log = lastLog(example(page, "spans-edit"))
  await page.locator('[data-slot="room-action"]', { hasText: "Later" }).click()
  await expect(log).toContainText("Standup 10:00–11:30")
  await page.locator('[data-slot="room-action"]', { hasText: "Longer" }).click()
  await expect(log).toContainText("Standup 10:00–12:00")
  await page
    .locator('[data-slot="room-action"]', { hasText: "Book Noon" })
    .click()
  await expect(log).toContainText("Lunch 12:00–13:00")
  await page
    .locator('[data-slot="room-action"]', { hasText: "Book Noon" })
    .click()
  await expect(log).toHaveText("Noon is taken")
  const atlas = page.getByRole("group", { name: "Atlas" }).last()
  const width = (await atlas.boundingBox())!.width
  const board = atlas.getByLabel(/^Board meeting, /)
  await press(page, board, width / 8, 0)
  await expect(board).not.toHaveAttribute("data-dragging")
  await page.mouse.up()
  const standup = atlas.getByLabel(/^Standup, /)
  await press(page, standup, width / 8, 0)
  await expect(standup).toHaveAttribute("data-dragging", "")
  await page.evaluate(() => window.dispatchEvent(new Event("blur")))
  await page.mouse.up()
  await expect(atlas.getByLabel("Standup, 10:00 to 12:00")).toBeVisible()
  await page.locator('[data-slot="room-action"]', { hasText: "Delete" }).click()
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText(
    "Standup is cancelled."
  )
  await expect(log).not.toContainText("Standup")
})

test("preview themes: hovering previews, Contrast previews as nothing, and arrows are read out", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const group = page.getByRole("radiogroup", { name: "Theme" })
  const paper = () =>
    example(page, "preview-themes")
      .locator('[data-slot="preview-sample"]')
      .evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--preview-paper")
      )
  await group.getByRole("radio", { name: "Dark" }).hover()
  await expect.poll(paper).toBe("#171717")
  await page.mouse.move(0, 0)
  await expect.poll(paper).toBe("#ffffff")
  await group.getByRole("radio", { name: /Contrast/ }).hover()
  await expect.poll(paper).toBe("#ffffff")
  await group.getByRole("radio", { name: "Sepia" }).click()
  await page.mouse.move(0, 0)
  await expect.poll(paper).toBe("#f4ecd8")
  await expect(group.getByRole("radio", { name: "Sepia" })).toHaveAttribute(
    "aria-checked",
    "true"
  )
  await page.keyboard.press("ArrowUp")
  await expect.poll(paper).toBe("#171717")
  await expect(page.locator("[data-ui-sdk-announcer='']")).toHaveText(
    "Trying the Dark theme. Enter keeps it, Escape puts it back."
  )
  await page.keyboard.press("Escape")
  await expect.poll(paper).toBe("#f4ecd8")
})

test("swipe dismiss: past a third of the width it shows it will dismiss, and letting go dismisses", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const list = page.getByRole("list", { name: "Notifications" })
  const toast = list.getByRole("listitem").filter({ hasText: "Event created" })
  await toast.scrollIntoViewIfNeeded()
  const box = (await toast.boundingBox())!
  const y = box.y + box.height / 2
  const start = box.x + box.width / 2
  await page.mouse.move(start, y)
  await page.mouse.down()
  await page.mouse.move(start + 60, y, { steps: 8 })
  await expect(toast.getByText("Dismiss", { exact: true })).toBeVisible()
  await page.mouse.move(start + 120, y, { steps: 8 })
  await expect(toast.getByText("Release to dismiss")).toBeVisible()
  await page.mouse.move(start + 60, y, { steps: 8 })
  await expect(toast.getByText("Dismiss", { exact: true })).toBeVisible()
  await page.mouse.up()
  await expect(list.getByRole("listitem")).toHaveCount(3)
  // 120 pixels is under half of the 288-pixel toast, and past its threshold.
  await page.mouse.move(start, y)
  await page.mouse.down()
  await page.mouse.move(start + 120, y, { steps: 8 })
  await page.mouse.up()
  await expect(list.getByRole("listitem")).toHaveCount(2)
  await list.getByRole("button", { name: "Dismiss Invite sent" }).click()
  await expect(list.getByRole("listitem")).toHaveCount(1)
  await page.getByRole("button", { name: "Show All" }).click()
  await expect(list.getByRole("listitem")).toHaveCount(3)
})

test("preview tabs: dragging a tab moves it into the nearest place, Escape cancels, and Alt with an arrow moves it", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const tablist = page.getByRole("tablist", { name: "Mailboxes" })
  const names = () => tablist.getByRole("tab").allTextContents()
  await tablist.scrollIntoViewIfNeeded()
  const inbox = (await tablist
    .getByRole("tab", { name: "Inbox" })
    .boundingBox())!
  const sent = (await tablist.getByRole("tab", { name: "Sent" }).boundingBox())!
  const y = inbox.y + inbox.height / 2
  await page.mouse.move(inbox.x + 10, y)
  await page.mouse.down()
  await page.mouse.move(sent.x + sent.width / 2, y, { steps: 12 })
  await page.keyboard.press("Escape")
  await page.mouse.up()
  expect(await names()).toEqual(["Inbox", "Drafts", "Sent", "Spam"])
  await page.mouse.move(inbox.x + 10, y)
  await page.mouse.down()
  await page.mouse.move(sent.x + sent.width / 2, y, { steps: 12 })
  await page.mouse.up()
  expect(await names()).toEqual(["Drafts", "Sent", "Inbox", "Spam"])
  const spam = tablist.getByRole("tab", { name: "Spam" })
  await spam.click()
  await page.keyboard.press("Alt+Home")
  expect(await names()).toEqual(["Spam", "Drafts", "Sent", "Inbox"])
  await expect(spam).toBeFocused()
  await page.keyboard.press("Alt+ArrowRight")
  expect(await names()).toEqual(["Drafts", "Spam", "Sent", "Inbox"])
  await page.keyboard.press("ArrowRight")
  await expect(tablist.getByRole("tab", { name: "Sent" })).toHaveAttribute(
    "aria-selected",
    "true"
  )
})

test("hold confirm: letting go early keeps the project, and a held press deletes it without clicking Restore", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const example = page.locator('[data-example="behaviors/hold-confirm"]')
  const remove = example.getByRole("button", { name: "Delete Project" })
  await expect(remove).toHaveAccessibleDescription("Press and hold to delete")
  await press(page, remove, 0, 0)
  await expect(remove).toHaveAttribute("data-holding", "")
  await page.mouse.up()
  await expect(
    page.getByText("Released before it filled", { exact: true })
  ).toBeVisible()
  await press(page, remove, 0, 0)
  await expect(example.getByText("Launch site deleted.")).toBeVisible()
  await page.mouse.up()
  await expect(example.getByText("Launch site deleted.")).toBeVisible()
  await example.getByRole("button", { name: "Restore" }).click()
  await remove.focus()
  await page.keyboard.down("Space")
  await expect(example.getByText("Launch site deleted.")).toBeVisible()
  await page.keyboard.up("Space")
})

test("hold repeat: a click steps once, and holding keeps stepping until it's released", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const zoom = example(page, "hold-repeat").getByRole("status")
  const zoomIn = example(page, "hold-repeat").getByRole("button", {
    name: "Zoom In",
  })
  const level = async () => parseInt((await zoom.textContent())!)
  await zoomIn.click()
  await expect(zoom).toHaveText("105%")
  await zoomIn.hover()
  await page.mouse.down()
  await expect(zoom).toHaveText("110%")
  await expect.poll(level).toBeGreaterThanOrEqual(150)
  await page.mouse.up()
  const released = await level()
  await page.waitForTimeout(300)
  expect(await level()).toBe(released)
})

test("hold repeat: sliding off the button pauses the repeats, and coming back goes on", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const zoom = example(page, "hold-repeat").getByRole("status")
  const zoomIn = example(page, "hold-repeat").getByRole("button", {
    name: "Zoom In",
  })
  const level = async () => parseInt((await zoom.textContent())!)
  await zoomIn.hover()
  await page.mouse.down()
  await expect.poll(level).toBeGreaterThanOrEqual(120)
  const box = (await zoomIn.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 80)
  await page.waitForTimeout(100)
  const paused = await level()
  await page.waitForTimeout(300)
  expect(await level()).toBe(paused)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect.poll(level).toBeGreaterThan(paused)
  await page.mouse.up()
})

test("hold repeat: Space steps once per press, and holding it keeps stepping", async ({
  page,
}) => {
  await openBehaviors(page, "direct-manipulation")
  const zoom = example(page, "hold-repeat").getByRole("status")
  const zoomOut = example(page, "hold-repeat").getByRole("button", {
    name: "Zoom Out",
  })
  const level = async () => parseInt((await zoom.textContent())!)
  await zoomOut.focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("Enter")
  await expect(zoom).toHaveText("90%")
  await page.keyboard.down("Space")
  await expect.poll(level).toBeLessThanOrEqual(60)
  await page.keyboard.up("Space")
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
      if (!href.startsWith("#")) {
        continue
      }
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)
    }
  }
})
