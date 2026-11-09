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
  const { errors } = await openBehaviors(page, "lists")
  await expect(page.locator("[data-example]")).toHaveCount(9)
  expect(errors).toEqual([])
})

test("virtualizer: only the rows in view are in the page, and scrolling renders the next", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Ledger" })
  await list.scrollIntoViewIfNeeded()
  await expect(list.getByText("Entry 1", { exact: true })).toBeVisible()
  expect(await list.getByRole("listitem").count()).toBeLessThan(30)
  await expect(list.getByRole("listitem").first()).toHaveAttribute(
    "aria-setsize",
    "10000"
  )
  await list.locator("..").evaluate((el) => (el.scrollTop = 32 * 5000))
  await expect(list.getByText("Entry 5001", { exact: true })).toBeVisible()
  await expect(list.getByText("Entry 1", { exact: true })).toHaveCount(0)
  expect(await list.getByRole("listitem").count()).toBeLessThan(30)
})

test("virtualizer find in page: a match on a row that isn't rendered scrolls to it, and the row holds the matched text", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Invoices" })
  await expect(list.locator("[data-findable-layer]")).toHaveCount(2)
  // Every row's number in page order, as find in page walks the text.
  const ids = () =>
    list.evaluate((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const found: number[] = []
      while (walker.nextNode()) {
        const match = /^INV-(\d+)$/.exec(walker.currentNode.textContent ?? "")
        if (match) {
          found.push(Number(match[1]))
        }
      }
      return found
    })
  const all = Array.from({ length: 10000 }, (_, index) => index + 1)
  expect(await ids()).toEqual(all)
  // A text fragment goes through the same match and reveal as the find bar, once the example has mounted.
  await page.goto(`${page.url().split("#")[0]}#:~:text=INV%2D08888`)
  const row = list.getByRole("listitem").filter({ hasText: "INV-08888" })
  await expect(row).toBeInViewport()
  await expect(row.locator("span").first()).toHaveText("INV-08888")
  await expect.poll(ids).toEqual(all)
})

test("stick to bottom: follows new lines, lets go on scroll up, and jumps back", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const log = page.getByRole("log", { name: "Build output" })
  await log.scrollIntoViewIfNeeded()
  const gap = () =>
    log.evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop)
  await expect(log.getByText("(12/80)")).toBeAttached()
  await expect.poll(gap).toBeLessThan(4)
  const jump = page.getByRole("button", { name: "Jump to latest" })
  await expect(jump).toBeHidden()
  await log.hover()
  await page.mouse.wheel(0, -200)
  await expect(jump).toBeVisible()
  await expect(log.getByText("(22/80)")).toBeAttached()
  expect(await gap()).toBeGreaterThan(40)
  await jump.click()
  await expect.poll(gap).toBeLessThan(4)
  await expect(jump).toBeHidden()
})

test("inline edit: Enter renames, Escape puts the name back, and typing starts over", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Playlists" })
  const first = list.getByRole("listitem").first()
  await first.focus()
  await page.keyboard.press("Enter")
  const input = page.getByLabel("Playlist name")
  await expect(input).toBeFocused()
  await expect(input).toHaveValue("Morning run")
  await page.keyboard.type("Evening walk")
  await page.keyboard.press("Enter")
  await expect(first).toHaveText("Evening walk")
  await expect(first).toBeFocused()

  await page.keyboard.press("ArrowDown")
  const second = list.getByRole("listitem").nth(1)
  await expect(second).toBeFocused()
  await page.keyboard.type("L")
  await expect(input).toHaveValue("L")
  await page.keyboard.press("Escape")
  await expect(second).toHaveText("Deep focus")
  await expect(second).toBeFocused()

  await second.dblclick()
  await page.keyboard.press("ControlOrMeta+A")
  await page.keyboard.press("Backspace")
  await page.keyboard.press("Enter")
  await expect(input).toBeFocused()
})

// Whether the rows in view sit one after another, each below the last.
async function stacked(list: Locator) {
  const boxes = await list
    .getByRole("listitem")
    .evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect()).sort((a, b) => a.top - b.top)
    )
  return boxes.every((box, i) => i === 0 || box.top >= boxes[i - 1].bottom - 1)
}

test("virtualizer measure: rows take their own heights, sizes follow a flip, and reset measures again", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Notes" })
  await list.scrollIntoViewIfNeeded()
  const heights = await list
    .getByRole("listitem")
    .evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().height))
    )
  expect(new Set(heights).size).toBeGreaterThan(1)
  expect(await stacked(list)).toBe(true)
  const size = async () => Number(await list.getAttribute("data-size"))
  const before = await size()
  await page
    .locator('[data-slot="notebook-action"]', { hasText: "Larger Text" })
    .click()
  await expect.poll(size).toBeGreaterThan(before)
  expect(await stacked(list)).toBe(true)
  await page
    .locator('[data-slot="notebook-action"]', { hasText: "Newest First" })
    .click()
  await expect(list.getByRole("listitem").first()).toHaveText(/^500\. /)
  await expect.poll(() => stacked(list)).toBe(true)
})

test("virtualizer jump: rows scroll into view below the header, more load near the end, and focus stays", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Contacts" })
  const scroller = list.locator("..")
  const action = (text: string) =>
    page.locator('[data-slot="contacts-action"]', { hasText: text })
  await scroller.scrollIntoViewIfNeeded()
  await action("Center 50").click()
  const row = list.getByRole("listitem").filter({ hasText: /^Tomasz 50$/ })
  await expect(row).toBeInViewport()
  await action("Show 80").click()
  await expect(
    list.getByRole("listitem").filter({ hasText: /^Tomasz 80$/ })
  ).toBeInViewport()
  await action("Last").click()
  await expect(scroller.getByText("200 contacts")).toBeVisible()
  await action("First").click()
  const first = list.getByRole("listitem").filter({ hasText: /^Hollis 1$/ })
  const header = (await scroller.getByText(/contacts$/).boundingBox())!
  await expect
    .poll(async () => (await first.boundingBox())!.y)
    .toBeGreaterThanOrEqual(header.y + header.height - 1)
  await first.click()
  await scroller.evaluate((el) => (el.scrollTop = 2400))
  await expect(
    list.getByRole("listitem").filter({ hasText: /^Hollis 81$/ })
  ).toBeAttached()
  await expect(first).toBeAttached()
  await expect(first).toBeFocused()
})

test("virtualizer horizontal: only the days in view are in the page, across", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const days = page.getByRole("list", { name: "Days" })
  await days.scrollIntoViewIfNeeded()
  await expect(days.getByText("Jan 1", { exact: true })).toBeVisible()
  expect(await days.getByRole("listitem").count()).toBeLessThan(20)
  await days.locator("..").evaluate((el) => (el.scrollLeft = 56 * 180))
  await expect(days.getByText("Jun 30", { exact: true })).toBeVisible()
  await expect(days.getByText("Jan 1", { exact: true })).toHaveCount(0)
})

test("stick chat: opens at the top, follows once at the end, keeps the view on older messages, and lets go", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const log = page.getByRole("log", { name: "Thread" })
  const status = lastLog(log)
  const action = (text: string) =>
    page.locator('[data-slot="thread-action"]', { hasText: text })
  const gap = () =>
    log.evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop)
  await log.scrollIntoViewIfNeeded()
  expect(await log.evaluate((el) => el.scrollTop)).toBe(0)
  await log.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await expect(status).toHaveText("Following, at the end")
  await action("Send").click()
  await expect(log.getByText("Message 13")).toBeAttached()
  await expect.poll(gap).toBeLessThan(4)
  await log.evaluate((el) => (el.scrollTop = 40))
  const top = await log
    .getByText("Message 3", { exact: true })
    .evaluate((el) => el.getBoundingClientRect().top)
  await action("Load Older").click()
  await expect(log.getByText("Older 5")).toBeAttached()
  await expect
    .poll(() =>
      log
        .getByText("Message 3", { exact: true })
        .evaluate((el) => el.getBoundingClientRect().top)
    )
    .toBeCloseTo(top, 0)
  await log.evaluate((el) => (el.scrollTop = el.scrollHeight))
  await expect(status).toHaveText("Following, at the end")
  await action("Let Go").click()
  await expect(status).toHaveText("Not following, at the end")
  // Within 48 pixels of the end still counts as there, so it takes two.
  await action("Send").click()
  await action("Send").click()
  await expect(status).toHaveText("Not following, new below")
})

test("inline edit fields: Tab saves and moves on, a price must be a number, the SKU is read-only, and Rename starts", async ({
  page,
}) => {
  await openBehaviors(page, "lists")
  const list = page.getByRole("list", { name: "Product" })
  const field = (name: string) =>
    list.getByRole("listitem", { name, exact: true })
  const input = list.getByLabel("Value")
  await field("Name").focus()
  await page.keyboard.press("Enter")
  await expect(input).toHaveValue("Desk lamp")
  await page.keyboard.type("Floor lamp")
  await page.keyboard.press("Tab")
  await expect(field("Name")).toContainText("Floor lamp")
  await expect(field("Price")).toBeFocused()
  await page.keyboard.type("x")
  await page.keyboard.press("Enter")
  await expect(input).toBeFocused()
  await page.keyboard.press("ControlOrMeta+A")
  await page.keyboard.type("59")
  await page.keyboard.press("Enter")
  await expect(field("Price")).toContainText("$59")
  await field("SKU").focus()
  await page.keyboard.press("Enter")
  await expect(input).toHaveCount(0)
  await page.locator('[data-slot="product-rename"]').click()
  await expect(input).toBeFocused()
  await expect(input).toHaveValue("Floor lamp")
  await page.keyboard.press("Escape")
  await expect(input).toHaveCount(0)
})

test("each option links to the example that shows it", async ({ page }) => {
  await openBehaviors(page, "lists")
  for (const label of [
    "VirtualizerOptions",
    "StickToBottomOptions",
    "InlineEditOptions",
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
