import { expect, menuNamed, missingLabelledBy, test } from "../fixtures"

// Behavior from the API alignment pass, in every framework: popups opened
// from outside their root with a payload and an awaitable result, context
// menus, menus that report through the root, find in page on tabs, and the
// web components' attribute schema.

const output = (page: import("@playwright/test").Page, name: string) =>
  page.locator(`output[aria-label="${name}"]`)

test.describe("triggers outside the root", () => {
  test("a row's trigger opens the menu with the row as its payload", async ({ page, open }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Actions for Two" }).click()
    const menu = page.getByRole("menu")
    await expect(menu).toBeVisible()
    await expect(menu.locator(".payload")).toHaveText("Row Two")
    await page.getByRole("menuitem", { name: "Rename" }).click()
    await expect(output(page, "Last action")).toHaveText("rename:Two")
  })

  test("only the trigger that opened the menu is expanded, and focus returns to it", async ({
    page,
    open,
  }) => {
    await open("alignment")
    const two = page.getByRole("button", { name: "Actions for Two" })
    await two.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused()
    await expect(two).toHaveAttribute("aria-expanded", "true")
    await expect(two).toHaveAttribute("data-open", "")
    await expect(page.getByRole("button", { name: "Actions for One" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
    await expect(page.getByRole("menu")).toHaveAccessibleName("Actions for Two")
    await page.keyboard.press("Escape")
    await expect(two).toBeFocused()
  })

  test("the menu reports when it has finished opening and closing", async ({ page, open }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Actions for One" }).click()
    await expect(output(page, "Last complete")).toHaveText("open")
    await page.keyboard.press("Escape")
    await expect(output(page, "Last complete")).toHaveText("closed")
  })

  test("content kept mounted stays in the page, hidden, while closed", async ({ page, open }) => {
    await open("alignment", { "keep-mounted": "" })
    const content = page.locator(".payload").first().locator("xpath=..")
    await expect(content).toBeAttached()
    await expect(content).toBeHidden()
    await expect(content).toHaveAttribute("data-closed", "")
    await page.getByRole("button", { name: "Actions for Three" }).click()
    await expect(page.getByRole("menu")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByRole("menu")).toHaveCount(0)
    await expect(content).toBeAttached()
  })
})

test.describe("awaitable popups", () => {
  test("open() resolves with how the popup closed, and a form with method dialog reports its button", async ({
    page,
    open,
  }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Show details" }).click()
    const dialog = page.getByRole("dialog", { name: "Details" })
    await expect(dialog).toBeVisible()
    await expect(dialog.locator(".payload")).toHaveText("Details for button")
    await dialog.getByRole("button", { name: "Save" }).click()
    await expect(dialog).toHaveCount(0)
    await expect(output(page, "Last result")).toHaveText("close-press:save")
    await page.getByRole("button", { name: "Show details" }).click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(output(page, "Last result")).toHaveText("escape-key:")
  })

  test("an item that opens a popover leaves focus in it, and closing it returns focus to the menu's trigger", async ({
    page,
    open,
  }) => {
    await open("alignment")
    const trigger = page.getByRole("button", { name: "Actions for One" })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    const dialog = page.getByRole("dialog", { name: "Details" })
    await expect(dialog.getByRole("button", { name: "Save" })).toBeFocused()
    await expect(dialog.locator(".payload")).toHaveText("Details for One")
    await page.keyboard.press("Escape")
    await expect(trigger).toBeFocused()
  })
})

test.describe("context menus", () => {
  test("a right-click opens the menu at the pointer, and another moves it", async ({ page, open }) => {
    await open("alignment")
    const canvas = page.locator(".canvas")
    const box = (await canvas.boundingBox())!
    await page.mouse.click(box.x + 10, box.y + 10, { button: "right" })
    const menu = page.getByRole("menu")
    await expect(menu).toBeVisible()
    const first = (await menu.boundingBox())!
    expect(Math.abs(first.x - (box.x + 10))).toBeLessThan(2)
    // Outside the open menu, which covers the first point.
    await page.mouse.click(box.x + 420, box.y + 15, { button: "right" })
    await expect(menu).toHaveCount(1)
    await expect.poll(async () => (await menu.boundingBox())!.x).toBeGreaterThan(first.x + 100)
    await page.getByRole("menuitem", { name: "Copy" }).click()
    await expect(output(page, "Last action")).toHaveText("copy")
  })

  test("the context menu points aria-labelledby at no missing element", async ({ page, open }) => {
    await open("alignment")
    await page.locator(".canvas").click({ button: "right" })
    await expect(page.getByRole("menu")).toBeVisible()
    expect(await missingLabelledBy(page)).toEqual([])
  })

  test("a left-click outside the open context menu closes it", async ({ page, open }) => {
    await open("alignment")
    const canvas = page.locator(".canvas")
    const box = (await canvas.boundingBox())!
    await page.mouse.click(box.x + 10, box.y + 10, { button: "right" })
    await expect(page.getByRole("menu")).toBeVisible()
    await page.mouse.click(box.x + 420, box.y + 15)
    await expect(page.getByRole("menu")).toHaveCount(0)
  })
})

test.describe("menus that report through the root", () => {
  test("a radio group without a label points aria-labelledby at no missing element", async ({
    page,
    open,
  }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Data" }).click()
    await expect(page.getByRole("menuitemradio", { name: "Name" })).toBeVisible()
    expect(await missingLabelledBy(page)).toEqual([])
  })

  test("checkbox and radio items report the item and the group", async ({ page, open }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Data" }).click()
    await page.getByRole("menuitemcheckbox", { name: "Grid" }).click()
    await expect(output(page, "Last change")).toHaveText("checked:grid:true")
    await page.getByRole("menuitemradio", { name: "Date" }).click()
    await expect(output(page, "Last change")).toHaveText("value:sort:date")
    await expect(page.getByRole("menuitemradio", { name: "Date" })).toHaveAttribute("data-checked", "")
  })

  test("item indicators show while their item is checked", async ({ page, open }) => {
    await open("alignment")
    await page.getByRole("button", { name: "View" }).click()
    const ruler = page.getByRole("menuitemcheckbox", { name: "Ruler" })
    await expect(ruler.locator(".indicator")).toBeHidden()
    await ruler.click()
    await expect(ruler.locator(".indicator")).toHaveAttribute("data-checked", "")
  })

  test("Enter while an input method composes text does nothing", async ({ page, open }) => {
    await open("alignment")
    await page.getByRole("button", { name: "Data" }).click()
    const grid = page.getByRole("menuitemcheckbox", { name: "Grid" })
    await grid.focus()
    await grid.evaluate((el) =>
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })),
    )
    await expect(grid).toHaveAttribute("aria-checked", "false")
    await expect(page.getByRole("menu")).toBeVisible()
  })
})

test.describe("tabs", () => {
  test("picking the first tab on mount is not a change", async ({ page, open }) => {
    await open("alignment")
    await expect(page.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true")
    await expect(output(page, "Tab changes")).toHaveText("0")
  })

  test("hidden panels stay findable, and a find in page match selects their tab", async ({ page, open }) => {
    await open("alignment")
    const panel = page.locator(".panel", { hasText: "The Delta section" })
    await expect(panel).toHaveAttribute("hidden", "until-found")
    await panel.evaluate((el) => el.dispatchEvent(new Event("beforematch")))
    await expect(page.getByRole("tab", { name: "Delta" })).toHaveAttribute("aria-selected", "true")
    await expect(output(page, "Tab changes")).toHaveText("1")
  })

  test("a tab selected from outside scrolls into view inside its list, and the page stays put", async ({
    page,
    open,
  }) => {
    await open("alignment")
    const scrollY = await page.evaluate(() => window.scrollY)
    await page.getByRole("button", { name: "Show the last section" }).click()
    await expect(page.getByRole("tab", { name: "Hotel" })).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tab", { name: "Hotel" })).toBeInViewport()
    const list = page.getByRole("tablist", { name: "Sections" })
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY)
  })
})

test.describe("render counts", () => {
  test("checking an item re-renders that item only", async ({ page, open, framework }) => {
    test.skip(!framework.startsWith("react"), "Counts React renders.")
    await open("alignment")
    await page.getByRole("button", { name: "View" }).click()
    await expect(menuNamed(page, "View")).toBeVisible()
    const before = await page.evaluate(() => ({ ...(window as any).__renders }))
    await page.getByRole("menuitemcheckbox", { name: "Ruler" }).click()
    await expect(page.getByRole("menuitemcheckbox", { name: "Ruler" })).toHaveAttribute(
      "aria-checked",
      "true",
    )
    const after = await page.evaluate(() => ({ ...(window as any).__renders }))
    expect(after.guides).toBe(before.guides)
    expect(after.ruler).toBeGreaterThan(before.ruler)
  })
})

test.describe("web component attributes", () => {
  test.beforeEach(({ framework }) => test.skip(!framework.startsWith("web"), "Web components only."))

  test("a false boolean attribute is false, and numbers are numbers", async ({ page, open }) => {
    await open("alignment")
    const result = await page.evaluate(async () => {
      const el = document.createElement("ui-popover")
      el.setAttribute("default-open", "false")
      el.innerHTML = `<ui-popover-trigger><button>Probe</button></ui-popover-trigger><ui-popover-content side-offset="12">Probe</ui-popover-content>`
      document.body.prepend(el)
      await new Promise((resolve) => setTimeout(resolve, 50))
      const { api } = el as unknown as { api: { isOpen: () => boolean; open: () => void } }
      const closed = api.isOpen()
      api.open()
      await new Promise((resolve) => setTimeout(resolve, 50))
      const trigger = el.querySelector("button")!.getBoundingClientRect()
      const content = el.querySelector("ui-popover-content")!
      const box = content.getBoundingClientRect()
      // The offset away from the trigger: a string offset would place it elsewhere.
      const gap =
        content.getAttribute("data-side") === "top" ? trigger.top - box.bottom : box.top - trigger.bottom
      el.remove()
      return { open: closed, gap: Math.round(gap) }
    })
    expect(result).toEqual({ open: false, gap: 12 })
  })

  test("the value attribute on tabs is live and fires no valuechange", async ({ page, open }) => {
    await open("alignment")
    await page.locator("ui-tabs").evaluate((el) => el.setAttribute("value", "golf"))
    await expect(page.getByRole("tab", { name: "Golf" })).toHaveAttribute("aria-selected", "true")
    await expect(output(page, "Tab changes")).toHaveText("0")
    expect(await page.locator("ui-tabs").evaluate((el) => (el as unknown as { value: string }).value)).toBe(
      "golf",
    )
  })

  test("canceling a change event keeps the state", async ({ page, open }) => {
    await open("alignment")
    await page
      .locator("ui-tabs")
      .evaluate((el) => el.addEventListener("valuechange", (event) => event.preventDefault()))
    await page.getByRole("tab", { name: "Bravo" }).click()
    await expect(page.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true")
  })

  test("an author's hidden attribute on a part survives state changes", async ({ page, open }) => {
    await open("alignment")
    await page
      .locator('ui-menu-checkbox-item[value="guides"]')
      .evaluate((el) => ((el as HTMLElement).hidden = true))
    await page.getByRole("button", { name: "View" }).click()
    await expect(page.getByRole("menuitemcheckbox", { name: "Ruler" })).toBeVisible()
    await page.getByRole("menuitemcheckbox", { name: "Ruler" }).click()
    await expect(page.getByRole("menuitemcheckbox", { name: "Guides" })).toBeHidden()
  })
})
