import { expect, test } from "../fixtures"
import {
  center,
  drag,
  editorSpace,
  panel,
  sidebarHandle,
  sizeOf,
} from "./resizable.helpers"

// Right to left, the first panel is on the right, so moving the handle left grows it.
test.beforeEach(async ({ open }) => {
  await open("resizable", { dir: "rtl" })
})

test("the first panel starts on the right", async ({ page }) => {
  const sidebar = (await panel(page, "Sidebar").boundingBox())!
  const main = (await panel(page, "Main").boundingBox())!
  expect(sidebar.x).toBeGreaterThan(main.x)
})

test(
  "ArrowLeft grows the panel before the handle",
  { tag: "@enhancement" },
  async ({ page }) => {
    await sidebarHandle(page).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "26")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await expect(sidebarHandle(page)).toHaveAttribute("aria-valuenow", "24")
  }
)

test(
  "dragging the handle left grows the panel before it",
  { tag: "@enhancement" },
  async ({ page }) => {
    await drag(page, await center(sidebarHandle(page)), { x: -60 })
    expect(await sizeOf(panel(page, "Sidebar"))).toBeCloseTo(
      editorSpace / 4 + 60,
      0
    )
  }
)
