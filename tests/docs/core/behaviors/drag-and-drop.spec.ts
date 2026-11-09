import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

// Drags from the middle of one element to a point relative to another.
async function drag(
  page: Page,
  from: Locator,
  to: Locator,
  offset = { x: 0.5, y: 0.5 }
) {
  await from.scrollIntoViewIfNeeded()
  const a = (await from.boundingBox())!
  const b = (await to.boundingBox())!
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2)
  await page.mouse.down()
  await page.mouse.move(b.x + b.width * offset.x, b.y + b.height * offset.y, {
    steps: 12,
  })
}

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "drag-and-drop")
  await expect(page.locator("[data-example]")).toHaveCount(15)
  expect(errors).toEqual([])
})

test("collapse: below the minimum the sidebar eases toward collapsing or the minimum, and lands on one", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const example = page.locator('[data-example="behaviors/bind-drag-collapse"]')
  const divider = page.getByRole("separator", { name: "Resize sidebar" })
  await divider.scrollIntoViewIfNeeded()
  const root = (await divider.locator("..").boundingBox())!
  const y = root.y + root.height / 2
  const press = async () => {
    const box = (await divider.boundingBox())!
    await page.mouse.move(box.x + box.width / 2, y)
    await page.mouse.down()
  }
  await expect(divider).toHaveAttribute("aria-valuenow", "160")
  // At 120 pixels the sidebar is on its way back to 160, at 140; at 40 it's on its way to collapsing, at 20.
  await press()
  await page.mouse.move(root.x + 120, y, { steps: 6 })
  await expect(divider).toHaveAttribute("aria-valuenow", "140")
  await expect(example.getByText("Release to open at 160px")).toBeVisible()
  await page.mouse.move(root.x + 40, y, { steps: 6 })
  await expect(divider).toHaveAttribute("aria-valuenow", "20")
  await expect(example.getByText("Release to collapse")).toBeVisible()
  await page.mouse.up()
  await expect(divider).toHaveAttribute("aria-valuetext", "Collapsed")
  await press()
  await page.mouse.move(root.x + 50, y, { steps: 6 })
  await page.mouse.up()
  await expect(divider).toHaveAttribute("aria-valuenow", "0")
  await press()
  await page.mouse.move(root.x + 100, y, { steps: 6 })
  await page.mouse.up()
  await expect(divider).toHaveAttribute("aria-valuenow", "160")
  await divider.focus()
  await page.keyboard.press("Enter")
  await expect(divider).toHaveAttribute("aria-valuetext", "Collapsed")
  await page.keyboard.press("Enter")
  await expect(divider).toHaveAttribute("aria-valuenow", "160")
  await page.keyboard.press("ArrowRight")
  await expect(divider).toHaveAttribute("aria-valuenow", "176")
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("ArrowLeft")
  await expect(divider).toHaveAttribute("aria-valuenow", "0")
})

test("pointer drags: the divider follows the pointer, commits on release, and Escape puts it back", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const divider = page.getByRole("separator", { name: "Resize panes" })
  await divider.scrollIntoViewIfNeeded()
  const root = (await divider.locator("..").boundingBox())!
  const box = (await divider.boundingBox())!
  await page.mouse.move(box.x + 2, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(root.x + root.width * 0.3, box.y + 20, { steps: 6 })
  await expect(divider).toHaveAttribute("aria-valuenow", "30")
  await page.keyboard.press("Escape")
  await page.mouse.up()
  await expect(divider).toHaveAttribute("aria-valuenow", "50")
  await page.mouse.move(box.x + 2, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(root.x + root.width * 0.7, box.y + 20, { steps: 6 })
  await page.mouse.up()
  await expect(divider).toHaveAttribute("aria-valuenow", "70")
  await divider.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(divider).toHaveAttribute("aria-valuenow", "65")
})

test("reorder: Space, an arrow and Space move an item, and a drag does too", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const list = page.getByRole("listbox", { name: "Favorite seasons" })
  await list.getByRole("option", { name: "Spring" }).focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Space")
  await expect(list.getByRole("option")).toHaveText([
    "1Summer",
    "2Spring",
    "3Autumn",
    "4Winter",
  ])
  await drag(
    page,
    list.getByRole("option", { name: "Winter" }),
    list.getByRole("option", { name: "Summer" }),
    {
      x: 0.5,
      y: 0.2,
    }
  )
  await page.mouse.up()
  await expect(list.getByRole("option")).toHaveText([
    "1Winter",
    "2Summer",
    "3Spring",
    "4Autumn",
  ])
})

test("tree reorder: Right takes a page in a level, and Escape puts it back", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const tree = page.getByRole("tree", { name: "Pages" })
  const changelog = tree.getByRole("treeitem", { name: "Changelog" })
  await changelog.focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowRight")
  await expect(changelog).toHaveAttribute("aria-level", "2")
  await page.keyboard.press("Escape")
  await expect(changelog).toHaveAttribute("aria-level", "1")
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowUp")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Space")
  await expect(tree.getByRole("treeitem")).toHaveText([
    "Guides",
    "Install",
    "Forms",
    "Reference",
    "Changelog",
    "Hooks",
  ])
  await expect(changelog).toHaveAttribute("aria-level", "2")
})

test("transfer: a drag moves an item to the other list, and Right does from the keyboard", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const closet = page.getByRole("listbox", { name: "Closet" })
  const bag = page.getByRole("listbox", { name: "Bag" })
  await drag(page, closet.getByRole("option", { name: "Boots" }), bag, {
    x: 0.5,
    y: 0.9,
  })
  await page.mouse.up()
  await expect(bag.getByRole("option")).toHaveText([
    "Passport",
    "Charger",
    "Boots",
  ])
  await closet.getByRole("option", { name: "Scarf" }).focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Space")
  await expect(bag.getByRole("option", { name: "Scarf" })).toBeVisible()
  await expect(closet.getByRole("option")).toHaveText(["Jacket"])
})

test("drag preview: a copy follows the pointer, and letting go over the note adds the tag", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const note = page.getByLabel("Note")
  await drag(page, page.getByRole("button", { name: "Design" }), note)
  await expect(page.locator("[data-drag-preview]")).toHaveText("Design")
  await expect(note).toHaveAttribute("data-over", "")
  await page.mouse.up()
  await expect(page.locator("[data-drag-preview]")).toHaveCount(0)
  await expect(note.locator('[data-slot="badge"]')).toHaveText(["Design"])
  await page.getByRole("button", { name: "Urgent" }).focus()
  await page.keyboard.press("Enter")
  await expect(note.locator('[data-slot="badge"]')).toHaveText([
    "Design",
    "Urgent",
  ])
})

test("reorder preview: holding a drag near the bottom edge scrolls the queue", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const queue = page.getByRole("listbox", { name: "Queue" })
  await queue.scrollIntoViewIfNeeded()
  const box = (await queue.boundingBox())!
  const first = (await queue
    .getByRole("option", { name: "Track 01" })
    .boundingBox())!
  await page.mouse.move(first.x + 20, first.y + 10)
  await page.mouse.down()
  await page.mouse.move(box.x + 40, box.y + box.height - 6, { steps: 10 })
  await expect
    .poll(() => queue.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  await page.mouse.up()
  await expect(queue.getByRole("option").first()).not.toHaveText("Track 01")
})

test("bind drag: the scrubber follows movement, and onStart refuses a locked drag", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const scrub = page.getByRole("slider", { name: "Opacity" })
  await scrub.scrollIntoViewIfNeeded()
  const box = (await scrub.boundingBox())!
  await page.mouse.move(box.x + 20, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + 80, box.y + box.height / 2, { steps: 6 })
  await page.mouse.up()
  await expect
    .poll(async () => Number(await scrub.getAttribute("aria-valuenow")))
    .toBeGreaterThan(50)
  const before = await scrub.getAttribute("aria-valuenow")
  await page.getByRole("checkbox", { name: "Locked" }).check()
  await page.mouse.move(box.x + 20, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + 120, box.y + box.height / 2, { steps: 6 })
  await page.mouse.up()
  await expect(scrub).toHaveAttribute("aria-valuenow", before!)
  await scrub.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(scrub).toHaveAttribute(
    "aria-valuenow",
    String(Number(before) - 1)
  )
})

test("reorder grid: Down moves a photo a row, and the order follows", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const album = page.getByRole("listbox", { name: "Album" })
  await album.getByRole("option", { name: "Dawn" }).focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Space")
  await expect(album.getByRole("option")).toHaveText([
    "Dune",
    "Fern",
    "Fjord",
    "Glacier",
    "Dawn",
    "Harbor",
    "Mesa",
    "Reef",
  ])
})

test("reorder group: ticked tasks move together as one block", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const list = page.getByRole("list", { name: "Backlog" })
  await page.getByRole("checkbox", { name: "Select Search" }).click()
  await page.getByRole("checkbox", { name: "Select Exports" }).click()
  await list.getByRole("listitem").filter({ hasText: "Exports" }).focus()
  await page.keyboard.press("Space")
  await expect(list.locator("[data-moving]")).toHaveCount(2)
  await page.keyboard.press("End")
  await page.keyboard.press("Space")
  await expect(list.getByRole("listitem")).toHaveText([
    "Login page",
    "Dark mode",
    "Billing",
    "Onboarding",
    "Search",
    "Exports",
  ])
})

test("reorder from code: move to top, and the toolbar's pick up, move, drop and cancel", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const list = page.getByRole("listbox", { name: "Recipe" })
  const steps = list.getByRole("option")
  await page.getByRole("button", { name: "Move Serve to top" }).click()
  await expect(steps.first()).toContainText("Serve")
  await steps.filter({ hasText: "Drain" }).focus()
  await page.getByRole("button", { name: "Pick Up" }).click()
  await page.getByRole("button", { name: "Move up" }).click()
  await page.getByRole("button", { name: "Move up" }).click()
  await page.getByRole("button", { name: "Drop" }).click()
  await expect(steps.nth(2)).toContainText("Drain")
  await steps.filter({ hasText: "Serve" }).focus()
  await page.getByRole("button", { name: "Pick Up" }).click()
  await page.getByRole("button", { name: "Move down" }).click()
  await page.getByRole("button", { name: "Cancel" }).click()
  await expect(steps.first()).toContainText("Serve")
})

test("reorder messages: the pinned track stays, and steps are read as track numbers", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const list = page.getByRole("listbox", { name: "Tracks" })
  const announcer = page.locator("[data-ui-sdk-announcer='assertive']")
  await list.getByRole("option", { name: /^Intro/ }).focus()
  await page.keyboard.press("Space")
  await expect(list.locator("[data-grabbed]")).toHaveCount(0)
  await list.getByRole("option", { name: /^Ember/ }).focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("Home")
  await expect(announcer).toHaveText("Ember, track 1.")
  await page.keyboard.press("Space")
  await expect(announcer).toHaveText("Dropped Ember at position 1 of 4.")
  await expect(list.getByRole("option").first()).toContainText("Ember")
})

test("tree limits: two levels at most, the Inbox stays, and the arrows indent and outdent", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const tree = page.getByRole("tree", { name: "Folders" })
  const level = (name: string) =>
    tree.getByRole("treeitem").filter({ hasText: name })
  // Personal holds Travel, which would go a third level deep.
  await page.getByRole("button", { name: "Indent Personal" }).click()
  await expect(level("Personal")).toHaveAttribute("aria-level", "1")
  await page.getByRole("button", { name: "Outdent Travel" }).click()
  await expect(level("Travel")).toHaveAttribute("aria-level", "1")
  await page.getByRole("button", { name: "Indent Personal" }).click()
  await expect(level("Personal")).toHaveAttribute("aria-level", "2")
  await page.getByRole("button", { name: "Outdent Personal" }).click()
  await expect(level("Personal")).toHaveAttribute("aria-level", "1")
  await level("Reports").focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Space")
  await expect(level("Reports")).toHaveAttribute("aria-level", "2")
  await level("Inbox").focus()
  await page.keyboard.press("Space")
  await expect(tree.locator("[data-moving]")).toHaveCount(0)
  await expect(
    page.locator("[data-ui-sdk-announcer='assertive']")
  ).not.toContainText("Picked up Inbox")
})

test("transfer board: a full column is skipped, the blocked card stays, and Done moves a card", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const column = (name: string) =>
    page.getByRole("listbox", { name, exact: true })
  await page.getByRole("button", { name: "Move Login to Done" }).click()
  await expect(column("Done").getByRole("option")).toHaveCount(2)
  await column("To do")
    .getByRole("option", { name: /^Search/ })
    .focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("Space")
  await expect(column("Doing").getByRole("option")).toHaveCount(2)
  await expect(page.locator("[data-ui-sdk-announcer='assertive']")).toHaveText(
    "Search is in Doing now."
  )
  await column("To do")
    .getByRole("option", { name: /^Billing/ })
    .focus()
  await page.keyboard.press("Space")
  await expect(
    page.locator('[data-slot="board-card"][aria-selected="true"]')
  ).toHaveCount(0)
  await column("Done")
    .getByRole("option", { name: /^Login/ })
    .focus()
  await page.keyboard.press("Space")
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("Space")
  await expect(
    column("To do").getByRole("option", { name: /^Login/ })
  ).toBeVisible()
})

test("auto scroll: a bookmark held near the bottom scrolls the chapters and lands where it's let go", async ({
  page,
}) => {
  await openBehaviors(page, "drag-and-drop")
  const chapters = page.getByRole("list", { name: "Chapters" })
  const bookmark = page.getByRole("button", { name: "Bookmark" })
  await chapters.scrollIntoViewIfNeeded()
  const from = (await bookmark.boundingBox())!
  const box = (await chapters.boundingBox())!
  await page.mouse.move(from.x + 10, from.y + 10)
  await page.mouse.down()
  await page.mouse.move(box.x + 40, box.y + box.height - 8, { steps: 10 })
  await expect
    .poll(() => chapters.evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100)
  await expect(chapters.locator("[data-over]")).toHaveCount(1)
  await page.mouse.up()
  const log = page
    .locator('[data-example="behaviors/auto-scroll"]')
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
  await expect(log).toHaveText(/^Bookmarked Chapter \d+$/)
  await expect(log).not.toHaveText("Bookmarked Chapter 5")
})

test("every option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "drag-and-drop")
  for (const label of [
    "BindDragOptions",
    "ReorderOptions",
    "TreeReorderOptions",
    "TransferOptions",
    "AutoScrollOptions",
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
