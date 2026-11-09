import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"

// Behavior follows the WAI-ARIA tree view pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

const item = (page: Page, name: string) =>
  page.getByRole("treeitem", { name, exact: true })

// A part of the item itself, not of the items nested in it.
const partOf = (page: Page, name: string, slot: string) =>
  item(page, name).locator(`:scope > [data-slot="tree-${slot}"]`)

async function expectFocused(page: Page, name: string) {
  await expect(item(page, name)).toBeFocused()
}

test.describe("expanding and collapsing", () => {
  test.beforeEach(async ({ open }) => {
    await open("tree")
  })

  test("branches start collapsed, and only top-level items show", async ({
    page,
  }) => {
    await expect(page.getByRole("tree", { name: "Files" })).toBeVisible()
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "false")
    await expect(item(page, "docs")).toHaveAttribute("aria-expanded", "false")
    await expect(item(page, "package.json")).not.toHaveAttribute(
      "aria-expanded"
    )
    await expect(page.getByRole("treeitem")).toHaveCount(3)
  })

  test("clicking a branch expands it and shows its children", async ({
    page,
  }) => {
    await item(page, "src").click()
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "index.ts")).toBeVisible()
    await expect(page.getByRole("group")).toHaveCount(1)
    expect(await lastAction(page)).toBe("action src")
  })

  test("clicking the indicator expands without selecting", async ({ page }) => {
    await partOf(page, "docs", "indicator").click()
    await expect(item(page, "docs")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "docs")).toHaveAttribute("aria-selected", "false")
    await expect(item(page, "docs")).toBeFocused()
  })

  test("a change can be canceled", async ({ page, open }) => {
    await open("tree", { cancel: "docs" })
    await partOf(page, "docs", "indicator").click()
    await expect(item(page, "docs")).toHaveAttribute("aria-expanded", "false")
    await partOf(page, "src", "indicator").click()
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
  })

  test("a default can expand nested branches", async ({ page, open }) => {
    await open("tree", { expanded: "src,components" })
    await expect(item(page, "button.tsx")).toBeVisible()
    await expect(page.getByRole("treeitem")).toHaveCount(8)
  })

  test("a controller expands and collapses everything", async ({ page }) => {
    await page.getByRole("button", { name: "Expand all" }).click()
    await expect(item(page, "intro.md")).toBeVisible()
    await expect(item(page, "dialog.tsx")).toBeVisible()
    await page.getByRole("button", { name: "Collapse all" }).click()
    await expect(page.getByRole("treeitem")).toHaveCount(3)
  })

  // Composed items reveal once they're in the page, which collapsed groups kept mounted are.
  test("reveal expands an item's ancestors and focuses it", async ({
    page,
    open,
  }) => {
    await open("tree", { "keep-mounted": "" })
    await page.getByRole("button", { name: "Reveal dialog" }).click()
    await expectFocused(page, "dialog.tsx")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "components")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
  })
})

test.describe("keyboard", () => {
  test.beforeEach(async ({ open }) => {
    await open("tree")
  })

  test("Tab reaches the tree once, on the first item", async ({
    page,
    tab,
  }) => {
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expectFocused(page, "src")
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("Down and Up move between the items that show", async ({ page }) => {
    await item(page, "src").focus()
    await page.keyboard.press("ArrowDown")
    await expectFocused(page, "docs")
    await page.keyboard.press("ArrowDown")
    await expectFocused(page, "package.json")
    await page.keyboard.press("ArrowDown")
    await expectFocused(page, "package.json")
    await page.keyboard.press("ArrowUp")
    await expectFocused(page, "docs")
  })

  test("Right expands a branch, then moves to its first child", async ({
    page,
  }) => {
    await item(page, "src").focus()
    await page.keyboard.press("ArrowRight")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await expectFocused(page, "src")
    await page.keyboard.press("ArrowRight")
    await expectFocused(page, "components")
  })

  test("Right on a leaf does nothing", async ({ page }) => {
    await item(page, "package.json").focus()
    await page.keyboard.press("ArrowRight")
    await expectFocused(page, "package.json")
  })

  test("Left collapses a branch, then moves to its parent", async ({
    page,
    open,
  }) => {
    await open("tree", { expanded: "src" })
    await item(page, "index.ts").focus()
    await page.keyboard.press("ArrowLeft")
    await expectFocused(page, "src")
    await page.keyboard.press("ArrowLeft")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "false")
    await expectFocused(page, "src")
  })

  test("Home and End move to the first and last items that show", async ({
    page,
    open,
  }) => {
    await open("tree", { expanded: "docs" })
    await item(page, "docs").focus()
    await page.keyboard.press("End")
    await expectFocused(page, "package.json")
    await page.keyboard.press("Home")
    await expectFocused(page, "src")
  })

  test("* expands every branch beside the focused item", async ({ page }) => {
    await item(page, "src").focus()
    await page.keyboard.press("*")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "docs")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "components")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  test("Alt+Right expands a branch and everything in it", async ({ page }) => {
    await item(page, "src").focus()
    await page.keyboard.press("Alt+ArrowRight")
    await expect(item(page, "components")).toHaveAttribute(
      "aria-expanded",
      "true"
    )
    await expect(item(page, "dialog.tsx")).toBeVisible()
  })

  test("typing moves to the next item that starts with the text", async ({
    page,
  }) => {
    await item(page, "src").focus()
    await page.keyboard.type("do")
    await expectFocused(page, "docs")
    await page.keyboard.press("p")
    await expect(item(page, "docs")).toBeFocused()
  })

  test("Enter selects the item and runs its action", async ({ page }) => {
    await item(page, "package.json").focus()
    await page.keyboard.press("Enter")
    await expect(item(page, "package.json")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(await lastAction(page)).toBe("action package.json")
  })

  test("a key on a nested item acts on that item only", async ({
    page,
    open,
  }) => {
    await open("tree", { expanded: "src" })
    await item(page, "index.ts").focus()
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("action index.ts")
    await expect(item(page, "src")).toHaveAttribute("aria-expanded", "true")
    await expect(item(page, "src")).toHaveAttribute("aria-selected", "false")
  })
})

test.describe("selection", () => {
  test("clicking an item selects it alone", async ({ page, open }) => {
    await open("tree")
    await item(page, "package.json").click()
    await expect(item(page, "package.json")).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await item(page, "docs").click()
    await expect(item(page, "package.json")).toHaveAttribute(
      "aria-selected",
      "false"
    )
    await expect(item(page, "docs")).toHaveAttribute("aria-selected", "true")
  })

  test("the selected item takes the tab stop", async ({ page, open, tab }) => {
    await open("tree", { default: "package.json" })
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await expectFocused(page, "package.json")
  })

  test("disabled items take focus but can't be selected", async ({
    page,
    open,
  }) => {
    await open("tree", { expanded: "src" })
    await item(page, "legacy.ts").click({ force: true })
    await expect(item(page, "legacy.ts")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await expect(item(page, "legacy.ts")).toHaveAttribute(
      "aria-selected",
      "false"
    )
    await item(page, "index.ts").focus()
    await page.keyboard.press("ArrowDown")
    await expectFocused(page, "legacy.ts")
  })

  test("with multiple selection, Shift+Down extends and Ctrl+A selects everything", async ({
    page,
    open,
  }) => {
    await open("tree", { selection: "multiple" })
    await expect(page.getByRole("tree")).toHaveAttribute(
      "aria-multiselectable",
      "true"
    )
    await item(page, "src").focus()
    await page.keyboard.press("Space")
    await page.keyboard.press("Shift+ArrowDown")
    await expect(item(page, "docs")).toHaveAttribute("aria-selected", "true")
    expect(await lastAction(page)).toBe("selected src,docs")
    await page.keyboard.press("Control+a")
    expect(await lastAction(page)).toBe("selected src,docs,package.json")
  })

  test("with automatic activation, moving focus selects", async ({
    page,
    open,
  }) => {
    await open("tree", { activation: "automatic" })
    await item(page, "src").focus()
    await page.keyboard.press("ArrowDown")
    await expect(item(page, "docs")).toHaveAttribute("aria-selected", "true")
  })

  test("without selection, items have no aria-selected", async ({
    page,
    open,
  }) => {
    await open("tree", { selection: "none" })
    await item(page, "package.json").click()
    await expect(item(page, "package.json")).not.toHaveAttribute(
      "aria-selected"
    )
    expect(await lastAction(page)).toBe("action package.json")
  })
})

test.describe("checkboxes", () => {
  test.beforeEach(async ({ open }) => {
    await open("tree", {
      checkable: "",
      selection: "none",
      expanded: "src,components",
    })
  })

  test("checking a branch checks everything in it", async ({ page }) => {
    await partOf(page, "components", "checkbox").click()
    await expect(item(page, "components")).toHaveAttribute(
      "aria-checked",
      "true"
    )
    await expect(item(page, "button.tsx")).toHaveAttribute(
      "aria-checked",
      "true"
    )
    await expect(item(page, "src")).toHaveAttribute("aria-checked", "mixed")
    expect(await lastAction(page)).toBe("checked button.tsx,dialog.tsx")
  })

  test("Space checks the focused item, and a disabled item keeps its check", async ({
    page,
  }) => {
    await item(page, "src").focus()
    await page.keyboard.press("Space")
    await expect(item(page, "index.ts")).toHaveAttribute("aria-checked", "true")
    await expect(item(page, "legacy.ts")).toHaveAttribute(
      "aria-checked",
      "false"
    )
    await expect(item(page, "src")).toHaveAttribute("aria-checked", "mixed")
    expect(await lastAction(page)).toBe(
      "checked button.tsx,dialog.tsx,index.ts"
    )
  })

  test("checking a leaf leaves the selection and the branch alone", async ({
    page,
  }) => {
    await partOf(page, "index.ts", "checkbox").click()
    await expect(item(page, "index.ts")).toHaveAttribute("aria-checked", "true")
    await expect(item(page, "index.ts")).not.toHaveAttribute("aria-selected")
    await expect(item(page, "src")).toHaveAttribute("aria-checked", "mixed")
  })
})

test.describe("positions", () => {
  test("every item says its level and place among its siblings", async ({
    page,
    open,
  }) => {
    await open("tree", { expanded: "src" })
    await expect(item(page, "src")).toHaveAttribute("aria-level", "1")
    await expect(item(page, "src")).toHaveAttribute("aria-posinset", "1")
    await expect(item(page, "src")).toHaveAttribute("aria-setsize", "3")
    await expect(item(page, "legacy.ts")).toHaveAttribute("aria-level", "2")
    await expect(item(page, "legacy.ts")).toHaveAttribute("aria-posinset", "3")
    await expect(item(page, "legacy.ts")).toHaveAttribute("aria-setsize", "3")
  })

  test("the current page's item is marked", async ({ page, open }) => {
    await open("tree", { current: "intro.md", expanded: "docs" })
    await expect(item(page, "intro.md")).toHaveAttribute("aria-current", "page")
  })
})
