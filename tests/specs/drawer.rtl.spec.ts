import { expect, test } from "../fixtures"
import {
  drawerDialog,
  drawerTrigger,
  openDrawer,
  pointerDrag,
  sheetRect,
} from "./drawer.helpers"

// Logical sides follow the writing direction: start is the right edge in a
// right-to-left layout, and dragging toward it closes the drawer. The
// reference only has physical sides.

test(
  'side="start" comes from the right in a right-to-left layout',
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer", { dir: "rtl", side: "start" })
    await openDrawer(page)
    expect((await sheetRect(page)).right).toBe(page.viewportSize()!.width)
    await expect(drawerDialog(page)).toHaveAttribute("data-side", "right")
  }
)

test(
  'side="end" comes from the left in a right-to-left layout',
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer", { dir: "rtl", side: "end" })
    await openDrawer(page)
    expect((await sheetRect(page)).left).toBe(0)
    await expect(drawerDialog(page)).toHaveAttribute("data-side", "left")
  }
)

test(
  "a drag toward the start edge closes it in a right-to-left layout",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("drawer", { dir: "rtl", side: "start" })
    await openDrawer(page)
    await pointerDrag(page, {
      from: "Move goal",
      dy: 0,
      dx: 240,
      steps: 20,
      interval: 30,
    })
    await expect(drawerDialog(page)).toBeHidden()
    await expect(drawerTrigger(page)).toBeFocused()
  }
)
