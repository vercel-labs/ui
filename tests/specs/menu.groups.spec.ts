import { changeItems, expect, test } from "../fixtures"

// Whole groups of items that move while the menu is open, like sections an
// app sorts. The keys follow the order on screen.
test("reordered groups move the keys with them", async ({ page, open }) => {
  await open("menu-groups")
  await page.getByRole("button", { name: "Actions" }).press("Enter")
  const item = (name: string) =>
    page.getByRole("menuitem", { name, exact: true })
  await expect(item("Undo")).toBeFocused()
  await changeItems(page, "reversed")
  await expect(page.getByRole("menuitem")).toHaveText([
    "Docs",
    "About",
    "Zoom in",
    "Zoom out",
    "Undo",
    "Redo",
  ])
  // A group that moves can take focus with it, so the pointer brings it back.
  await item("Zoom in").hover()
  await expect(item("Zoom in")).toBeFocused()
  await page.keyboard.press("Home")
  await expect(item("Docs")).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowDown")
  await expect(item("Zoom in")).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("ArrowDown")
  await expect(item("Undo")).toBeFocused()
  await page.keyboard.press("End")
  await expect(item("Redo")).toBeFocused()
})
