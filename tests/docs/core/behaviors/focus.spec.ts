import { expect } from "@playwright/test"
import { test } from "../../docs-test"
import { openBehaviors } from "./helpers"

test("every example renders without errors", async ({ page }) => {
  const { errors } = await openBehaviors(page, "focus")
  await expect(page.locator("[data-example]")).toHaveCount(17)
  expect(errors).toEqual([])
})

test("roving focus: one tab stop, arrows and End move along the toolbar", async ({ page }) => {
  await openBehaviors(page, "focus")
  const toolbar = page.getByRole("toolbar", { name: "Formatting" })
  await expect(toolbar.locator('[tabindex="0"]')).toHaveCount(1)
  await toolbar.getByRole("button", { name: "Bold" }).focus()
  await page.keyboard.press("ArrowRight")
  await expect(toolbar.getByRole("button", { name: "Italic" })).toBeFocused()
  await page.keyboard.press("End")
  await expect(toolbar.getByRole("button", { name: "Strike" })).toBeFocused()
})

test("roving focus: Tab skips disabled items, the arrows reach them, and the column wraps", async ({
  page,
}) => {
  await openBehaviors(page, "focus")
  const toolbar = page.getByRole("toolbar", { name: "Edit" })
  await expect(toolbar.locator('[tabindex="0"]')).toHaveText("Cut")
  await toolbar.getByRole("button", { name: "Cut" }).focus()
  await page.keyboard.press("ArrowUp")
  await expect(toolbar.getByRole("button", { name: "Redo" })).toBeFocused()
  await expect(toolbar.getByRole("button", { name: "Redo" })).toHaveAttribute("aria-disabled", "true")
  await page.keyboard.press("ArrowUp")
  await page.keyboard.press("ArrowUp")
  await expect(toolbar.getByRole("button", { name: "Paste" })).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(toolbar.getByRole("button", { name: "Undo" })).toBeFocused()
})

test("roving focus: the arrows skip the labels under a closed Labels row", async ({ page }) => {
  await openBehaviors(page, "focus")
  const folders = page.getByRole("group", { name: "Folders" })
  await folders.getByRole("button", { name: "Labels" }).focus()
  await page.keyboard.press("ArrowDown")
  await expect(folders.getByRole("button", { name: "Trash" })).toBeFocused()
  await page.keyboard.press("ArrowUp")
  await page.keyboard.press("Enter")
  await expect(folders.getByRole("button", { name: "Labels" })).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("ArrowDown")
  await expect(folders.getByRole("button", { name: "Work" })).toBeFocused()
  await page.keyboard.press("End")
  await expect(folders.getByRole("button", { name: "Trash" })).toBeFocused()
})

test("roving focus: a new tag takes focus once it renders, and the count follows", async ({ page }) => {
  await openBehaviors(page, "focus")
  const tags = page.getByRole("group", { name: "Tags" })
  await expect(page.getByText("2 tags")).toBeVisible()
  await page.getByRole("textbox", { name: "New tag" }).fill("release")
  await page.keyboard.press("Enter")
  await expect(tags.getByRole("button", { name: "release" })).toBeFocused()
  await expect(page.getByText("3 tags")).toBeVisible()
  await expect(tags.locator('[tabindex="0"]')).toHaveText("release")
  await page.keyboard.press("Home")
  await expect(tags.getByRole("button", { name: "design" })).toBeFocused()
})

test("roving focus: a shortcut in the field moves the toolbar's stop to its button", async ({ page }) => {
  await openBehaviors(page, "focus")
  const toolbar = page.getByRole("toolbar", { name: "Format", exact: true })
  await expect(toolbar.locator('[tabindex="0"]')).toHaveText("Bold")
  await page.getByRole("textbox", { name: "Notes" }).focus()
  await page.keyboard.press("Control+u")
  await expect(toolbar.locator('[tabindex="0"]')).toHaveText("Underline")
  await page.keyboard.press("Shift+Tab")
  await expect(toolbar.getByRole("button", { name: "Underline" })).toBeFocused()
})

test("roving focus: each option links to its explanation", async ({ page }) => {
  await openBehaviors(page, "focus")
  for (const label of ["RovingFocusOptions"]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const id = (await link.getAttribute("href"))!.slice(1)
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    }
  }
})

test("roving focus: a custom move goes a row at a time on the keypad", async ({ page }) => {
  await openBehaviors(page, "focus")
  const keypad = page.getByRole("group", { name: "Keypad" })
  await expect(keypad.locator('[tabindex="0"]')).toHaveCount(1)
  await keypad.getByRole("button", { name: "1" }).focus()
  await page.keyboard.press("ArrowDown")
  await expect(keypad.getByRole("button", { name: "4" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(keypad.getByRole("button", { name: "5" })).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowDown")
  await expect(keypad.getByRole("button", { name: "8" })).toBeFocused()
  await page.keyboard.press("ArrowUp")
  await expect(keypad.getByRole("button", { name: "5" })).toBeFocused()
})

test("spatial focus: arrows go to the nearest note that way", async ({ page }) => {
  await openBehaviors(page, "focus")
  const board = page.getByRole("group", { name: "Notes" })
  await board.getByRole("button", { name: "Call Ana" }).focus()
  await page.keyboard.press("ArrowDown")
  await expect(board.getByRole("button", { name: "Review" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(board.getByRole("button", { name: "Lunch" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(board.getByRole("button", { name: "Gym" })).toBeFocused()
  await page.keyboard.press("ArrowUp")
  await expect(board.getByRole("button", { name: "Ship docs" })).toBeFocused()
})

test("typeahead: typing steps through matches and jumps to a longer one", async ({ page }) => {
  await openBehaviors(page, "focus")
  const list = page.getByRole("listbox", { name: "Fruit" })
  await list.getByRole("option", { name: "Apple" }).focus()
  await page.keyboard.press("p")
  await expect(list.getByRole("option", { name: "Peach" })).toBeFocused()
  await page.keyboard.press("p")
  await expect(list.getByRole("option", { name: "Pear" })).toBeFocused()
  await page.waitForTimeout(600)
  await page.keyboard.type("pl")
  await expect(list.getByRole("option", { name: "Plum" })).toBeFocused()
})

test("focus recovery: deleting the focused task focuses the one in its place", async ({ page }) => {
  await openBehaviors(page, "focus")
  const list = page.getByRole("list", { name: "Tasks" })
  await list.getByRole("listitem").filter({ hasText: "Add examples" }).focus()
  await page.keyboard.press("Delete")
  await expect(list.getByRole("listitem").filter({ hasText: "Fix the links" })).toBeFocused()
  await page.keyboard.press("End")
  await page.keyboard.press("Delete")
  await expect(list.getByRole("listitem").filter({ hasText: "Fix the links" })).toBeFocused()
})

test("grid focus: arrows move by row and column, Control+End to the last seat", async ({ page }) => {
  await openBehaviors(page, "focus")
  const grid = page.getByRole("grid", { name: "Seats" })
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
  await grid.getByRole("gridcell", { name: "Seat A1" }).focus()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowRight")
  await expect(grid.getByRole("gridcell", { name: "Seat B2" })).toBeFocused()
  await page.keyboard.press("Control+End")
  await expect(grid.getByRole("gridcell", { name: "Seat C6" })).toBeFocused()
})

test("roving focus: Left and Right keep cycling around the ring", async ({ page }) => {
  await openBehaviors(page, "focus")
  const ring = page.getByRole("toolbar", { name: "Message" })
  await ring.getByRole("button", { name: "Reply" }).focus()
  for (const name of ["Label", "Delete", "Snooze", "Archive", "Forward", "Reply", "Label"]) {
    await page.keyboard.press("ArrowLeft")
    await expect(ring.getByRole("button", { name, exact: true })).toBeFocused()
    await expect(ring.locator('[tabindex="0"]')).toHaveCount(1)
  }
  for (const name of ["Reply", "Forward", "Archive", "Snooze", "Delete", "Label", "Reply"]) {
    await page.keyboard.press("ArrowRight")
    await expect(ring.getByRole("button", { name, exact: true })).toBeFocused()
  }
  await page.keyboard.press("End")
  await expect(ring.getByRole("button", { name: "Label" })).toBeFocused()
  await page.keyboard.press("Home")
  await expect(ring.getByRole("button", { name: "Reply" })).toBeFocused()
})

test("nearest in a direction: the map keeps focus while the arrows and buttons choose a city", async ({
  page,
}) => {
  await openBehaviors(page, "focus")
  const map = page.getByRole("img", { name: /^Map/ })
  await expect(map).toHaveAccessibleName("Map, Paris chosen")
  await map.focus()
  await page.keyboard.press("ArrowUp")
  await expect(map).toHaveAccessibleName("Map, London chosen")
  await page.keyboard.press("ArrowRight")
  await expect(map).toHaveAccessibleName("Map, Berlin chosen")
  await expect(map).toBeFocused()
  await page.getByRole("button", { name: "South" }).click()
  await expect(map).toHaveAccessibleName("Map, Vienna chosen")
  await page.getByRole("button", { name: "West" }).click()
  await expect(map).toHaveAccessibleName("Map, Paris chosen")
})

test("keep focus: a task that moves to the other list keeps focus, and loses it without", async ({
  page,
}) => {
  await openBehaviors(page, "focus")
  const todo = page.getByRole("list", { name: "To do" })
  const done = page.getByRole("list", { name: "Done" })
  await todo.getByRole("button", { name: "Add examples" }).focus()
  await page.keyboard.press("Enter")
  await expect(done.getByRole("button", { name: "Add examples" })).toBeFocused()
  await page.keyboard.press("Space")
  await expect(todo.getByRole("button", { name: "Add examples" })).toBeFocused()
  await page.getByRole("checkbox", { name: "Keep focus on the task" }).uncheck()
  await todo.getByRole("button", { name: "Fix the links" }).focus()
  await page.keyboard.press("Enter")
  await expect(done.getByRole("button", { name: "Fix the links" })).toBeVisible()
  await expect(done.getByRole("button", { name: "Fix the links" })).not.toBeFocused()
})

test("grid focus: the arrows skip taken seats, and the active seat stays marked", async ({ page }) => {
  await openBehaviors(page, "focus")
  const grid = page.getByRole("grid", { name: "Theater" })
  await grid.getByRole("gridcell", { name: "Seat A1", exact: true }).focus()
  await page.keyboard.press("ArrowRight")
  await expect(grid.getByRole("gridcell", { name: "Seat A4" })).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(grid.getByRole("gridcell", { name: "Seat C4" })).toBeFocused()
  await page.keyboard.press("Home")
  await expect(grid.getByRole("gridcell", { name: "Seat C2" })).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(grid.getByRole("gridcell", { name: "Seat C2" })).toHaveAttribute("data-active", "")
  await expect(grid.locator("[data-active]")).toHaveCount(1)
})

test("grid focus: Shift with the arrows stretches a range, and a plain move starts over", async ({
  page,
}) => {
  await openBehaviors(page, "focus")
  const grid = page.getByRole("grid", { name: "Sheet" })
  const selected = grid.locator('[aria-selected="true"]')
  await grid.getByRole("gridcell", { name: "A1" }).click()
  await page.keyboard.press("Shift+ArrowRight")
  await page.keyboard.press("Shift+ArrowDown")
  await expect(selected).toHaveText(["A1", "B1", "A2", "B2"])
  await page.keyboard.press("ArrowRight")
  await expect(selected).toHaveText(["C2"])
  await grid.getByRole("gridcell", { name: "D4" }).click({ modifiers: ["Shift"] })
  await expect(selected).toHaveCount(6)
})

test("grid focus: the window slides to rows that aren't rendered, and Page Down moves a page", async ({
  page,
}) => {
  await openBehaviors(page, "focus")
  const grid = page.getByRole("grid", { name: "Departures" })
  const window = page.locator("[data-window]")
  await expect(grid.getByRole("row")).toHaveCount(6)
  await grid.getByRole("gridcell", { name: "06:35" }).click()
  await page.keyboard.press("ArrowDown")
  await expect(grid.getByRole("gridcell", { name: "06:42" })).toBeFocused()
  await expect(window).toHaveText("Rows 2 to 7 of 100")
  await page.keyboard.press("PageDown")
  await expect(grid.getByRole("gridcell", { name: "07:24" })).toBeFocused()
  await expect(window).toHaveText("Rows 8 to 13 of 100")
  await page.keyboard.press("Control+End")
  await expect(window).toHaveText("Rows 95 to 100 of 100")
  await expect(grid.getByRole("row").last()).toHaveAttribute("aria-rowindex", "100")
  await expect(grid.locator(":focus")).toHaveText("Platform 4")
})

test("grid focus: each option links to its explanation", async ({ page }) => {
  await openBehaviors(page, "focus")
  for (const label of ["GridFocusOptions"]) {
    const table = page.getByLabel(label, { exact: true })
    const fields = table.locator("dt")
    const links = table.getByRole("link")
    await expect(fields).not.toHaveCount(0)
    await expect(links).toHaveCount(await fields.count())
    for (const link of await links.all()) {
      const id = (await link.getAttribute("href"))!.slice(1)
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    }
  }
})

test("input hints: each field gets its keyboard and Return key", async ({ page }) => {
  await openBehaviors(page, "focus")
  const form = page.locator("form").filter({ has: page.getByRole("textbox", { name: "Verification code" }) })
  const email = form.getByRole("textbox", { name: "Email" })
  await expect(email).toHaveAttribute("inputmode", "email")
  await expect(email).toHaveAttribute("enterkeyhint", "next")
  await expect(email).toHaveAttribute("autocapitalize", "none")
  await expect(form.getByRole("textbox", { name: "Verification code" })).toHaveAttribute(
    "autocomplete",
    "one-time-code",
  )
  await expect(form.getByRole("textbox", { name: "Message" })).toHaveAttribute("enterkeyhint", "send")
})
