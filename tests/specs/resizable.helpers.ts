import type { Locator, Page } from "@playwright/test"

// Handles are separators named by their label. Panels are groups named by
// theirs, which the fixture gives them.
const handle = (page: Page, name: string) =>
  page.getByRole("separator", { name, exact: true })
const panel = (page: Page, name: string) =>
  page.getByRole("group", { name, exact: true })
const sidebarHandle = (page: Page) => handle(page, "Resize sidebar")
const previewHandle = (page: Page) => handle(page, "Resize preview")
const terminalHandle = (page: Page) => handle(page, "Resize terminal")

async function status(page: Page, name: "Last action" | "Committed") {
  return page.getByRole("status", { name }).textContent()
}

// A panel's size along an axis, in CSS pixels.
async function sizeOf(locator: Locator, axis: "width" | "height" = "width") {
  return (await locator.boundingBox())![axis]
}

async function center(locator: Locator) {
  const box = (await locator.boundingBox())!
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

// Drags from a point by an offset, in steps, so every engine sends moves.
async function drag(
  page: Page,
  from: { x: number; y: number },
  by: { x?: number; y?: number }
) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + (by.x ?? 0), from.y + (by.y ?? 0), {
    steps: 8,
  })
  await page.mouse.up()
}

// The editor group is 800 pixels wide with a 1px border and two 2px handles,
// so its panels share 794 pixels, and a percent is 7.94 of them.
const editorSpace = 794

export {
  center,
  drag,
  editorSpace,
  handle,
  panel,
  previewHandle,
  sidebarHandle,
  sizeOf,
  status,
  terminalHandle,
}
