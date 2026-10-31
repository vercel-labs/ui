import { expect, focusIsWithin, isSheet, lastAction, menuNamed, test, waitForStill } from "../fixtures"
import { addScroller, composingEscape, moveIntoShadowRoot } from "../fixtures/popup"

// Behavior follows the WAI-ARIA menu button pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

test.beforeEach(async ({ open }) => {
  await open("menu")
})

test.describe("trigger", () => {
  test("advertises its menu and reflects the open state", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")

    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  test("click opens the menu and moves focus into it", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await expect.poll(() => focusIsWithin(page, "menu")).toBe(true)
  })

  test("click on the open trigger closes the menu", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await trigger.click()
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  for (const key of ["Enter", " ", "ArrowDown"]) {
    test(`${key === " " ? "Space" : key} opens the menu and focuses the first item`, async ({ page }) => {
      await page.getByRole("button", { name: "File" }).focus()
      await page.keyboard.press(key)
      await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
    })
  }

  test("ArrowUp opens the menu and focuses the last item", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
  })

  test("a click on a trigger in a shadow root opens the menu, and it stays open", async ({
    page,
    framework,
  }) => {
    test.skip(
      framework.startsWith("react"),
      "React stops hearing events once its tree moves into a shadow root.",
    )
    await moveIntoShadowRoot(page.locator(".fixture"))
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.waitForTimeout(100)
    await expect(menuNamed(page, "File")).toBeVisible()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })
})

test.describe("keyboard navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("ArrowDown and ArrowUp move between items, skipping separators and labels", async ({ page }) => {
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Open…" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitemcheckbox", { name: "Show sidebar" })).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "Open…" })).toBeFocused()
  })

  test("disabled items are focusable", async ({ page }) => {
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    const save = page.getByRole("menuitem", { name: "Save" })
    await expect(save).toBeFocused()
    await expect(save).toHaveAttribute("aria-disabled", "true")
  })

  test("focus wraps at both ends", async ({ page }) => {
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("Home and End move to the first and last items", async ({ page }) => {
    await page.keyboard.press("End")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
    await page.keyboard.press("Home")
    await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
  })

  test("typing a character moves to the next item that starts with it", async ({ page }) => {
    await page.keyboard.press("d")
    await expect(page.getByRole("menuitemradio", { name: "Date" })).toBeFocused()
    await page.waitForTimeout(800)
    await page.keyboard.press("d")
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()
  })

  test("typing several characters quickly matches the whole prefix", async ({ page }) => {
    await page.keyboard.type("sha")
    await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  })
})

test.describe("activation", () => {
  test("Enter on an item runs it, closes the menu and returns focus", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("open")
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("clicking an item runs it and closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Delete" }).click()
    expect(await lastAction(page)).toBe("delete")
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test("disabled items do nothing", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    // A forced press doesn't wait for a rising sheet.
    await waitForStill(menuNamed(page, "File"))
    await page.getByRole("menuitem", { name: "Save" }).click({ force: true })
    expect(await lastAction(page)).toBe("")
    await expect(menuNamed(page, "File")).toBeVisible()
  })

  test("checkbox items toggle and keep the menu open", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    const sidebar = page.getByRole("menuitemcheckbox", { name: "Show sidebar" })
    await expect(sidebar).toHaveAttribute("aria-checked", "true")
    await sidebar.click()
    await expect(sidebar).toHaveAttribute("aria-checked", "false")
    await expect(menuNamed(page, "File")).toBeVisible()

    await sidebar.focus()
    await page.keyboard.press(" ")
    await expect(sidebar).toHaveAttribute("aria-checked", "true")
  })

  test("radio items select one value and keep the menu open", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    const name = page.getByRole("menuitemradio", { name: "Name" })
    const date = page.getByRole("menuitemradio", { name: "Date" })
    await expect(name).toHaveAttribute("aria-checked", "true")
    await date.click()
    await expect(date).toHaveAttribute("aria-checked", "true")
    await expect(name).toHaveAttribute("aria-checked", "false")
    await expect(menuNamed(page, "File")).toBeVisible()
  })

  test("hovering an item highlights it", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    const item = page.getByRole("menuitem", { name: "Open…" })
    await item.hover()
    await expect(item).toHaveAttribute("data-highlighted", "")
    await expect(item).toBeFocused()
  })
})

test.describe("dismissal", () => {
  test("Escape closes the menu and returns focus to the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    await page.keyboard.press("Escape")
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("clicking outside closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.mouse.click(5, 5)
    await expect(menuNamed(page, "File")).toBeHidden()
  })

  test(
    "Escape while an input method is composing text leaves the menu open",
    { tag: "@enhancement" },
    async ({ page }) => {
      await page.getByRole("button", { name: "File" }).focus()
      await page.keyboard.press("Enter")
      await expect(page.getByRole("menuitem", { name: "New file" })).toBeFocused()
      await composingEscape(page)
      await page.waitForTimeout(100)
      await expect(menuNamed(page, "File")).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(menuNamed(page, "File")).toBeHidden()
    },
  )

  test("pressing a scrollbar outside the menu leaves it open", async ({ page }) => {
    const scrollbar = await addScroller(page)
    test.skip(!scrollbar, "This browser hides scrollbars in automation.")
    await page.getByRole("button", { name: "File" }).click()
    await expect(menuNamed(page, "File")).toBeVisible()
    await page.mouse.click(scrollbar!.x, scrollbar!.y)
    await page.waitForTimeout(100)
    await expect(menuNamed(page, "File")).toBeVisible()
  })

  test("Tab closes the menu", async ({ page, tab }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await tab()
    await expect(menuNamed(page, "File")).toBeHidden()
    await expect.poll(() => focusIsWithin(page, "menu")).toBe(false)
  })
})

test.describe("submenu", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("button", { name: "File" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.type("sha")
    await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  })

  test("the submenu trigger advertises its menu", { tag: "@enhancement" }, async ({ page }) => {
    const share = page.getByRole("menuitem", { name: "Share" })
    await expect(share).toHaveAttribute("aria-haspopup", "menu")
    await expect(share).toHaveAttribute("aria-expanded", "false")
    await page.keyboard.press("ArrowRight")
    await expect(share).toHaveAttribute("aria-expanded", "true")
  })

  for (const key of ["ArrowRight", "Enter", " "]) {
    const tag = key === " " ? ["@enhancement"] : []
    test(
      `${key === " " ? "Space" : key} opens the submenu and focuses its first item`,
      { tag },
      async ({ page }) => {
        await page.keyboard.press(key)
        await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
      },
    )
  }

  test("ArrowLeft closes the submenu and returns focus to its trigger", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(menuNamed(page, "Share")).toBeHidden()
    await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
    await expect(menuNamed(page, "File")).toBeVisible()
  })

  test("nested submenus open and run their items", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
    await page.keyboard.press("End")
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Embed" })).toBeFocused()
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("embed")
    await expect(page.getByRole("menu")).toHaveCount(0)
    await expect(page.getByRole("button", { name: "File" })).toBeFocused()
  })

  test("submenu keyboard navigation stays inside the submenu", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(page.getByRole("menuitem", { name: "More" })).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
  })

  test("keys pressed in quick succession are never lost", { tag: "@enhancement" }, async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("End")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("embed")
  })

  test("clicking outside closes every menu", async ({ page }) => {
    await page.keyboard.press("ArrowRight")
    await page.mouse.click(5, 5)
    await expect(page.getByRole("menu")).toHaveCount(0)
  })
})

test.describe("submenu with a pointer", () => {
  test.beforeEach(({ fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "In a sheet, a submenu opens on a press, in its parent's place.")
  })

  test("hovering the submenu trigger opens it", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    await expect(menuNamed(page, "Share")).toBeVisible()
  })

  test("moving diagonally toward the submenu keeps it open", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    const share = page.getByRole("menuitem", { name: "Share" })
    await share.hover()
    const submenu = menuNamed(page, "Share")
    await expect(submenu).toBeVisible()

    // Cross the item below Share on the way to the submenu's last item.
    const from = (await share.boundingBox())!
    const to = (await page.getByRole("menuitem", { name: "More" }).boundingBox())!
    await page.mouse.move(from.x + from.width - 12, from.y + from.height / 2)
    await page.mouse.move(to.x + 12, to.y + to.height / 2, { steps: 12 })

    await expect(submenu).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "More" })).toHaveAttribute("data-highlighted", "")
  })

  test("moving to a sibling item closes the submenu", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    await expect(menuNamed(page, "Share")).toBeVisible()
    const open = (await page.getByRole("menuitem", { name: "Open…" }).boundingBox())!
    await page.mouse.move(open.x + 12, open.y + open.height / 2, { steps: 8 })
    await expect(menuNamed(page, "Share")).toBeHidden()
  })

  test("leaving the menu from the submenu trigger before it opens keeps the submenu closed", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "File" }).click()
    const share = (await page.getByRole("menuitem", { name: "Share" }).boundingBox())!
    const menu = (await menuNamed(page, "File").boundingBox())!
    await page.mouse.move(share.x + 12, share.y + share.height / 2)
    await page.mouse.move(menu.x - 40, share.y + share.height / 2, { steps: 2 })
    await page.waitForTimeout(300)
    await expect(menuNamed(page, "Share")).toBeHidden()
  })

  test("returning to the submenu trigger from a separator opens it", async ({ page }) => {
    await page.getByRole("button", { name: "File" }).click()
    const share = (await page.getByRole("menuitem", { name: "Share" }).boundingBox())!
    const separator = (await menuNamed(page, "File").getByRole("separator").last().boundingBox())!
    const x = share.x + 12
    const y = share.y + share.height / 2
    await page.mouse.move(x, y)
    await page.mouse.move(x, separator.y + separator.height / 2)
    await page.mouse.move(x, y)
    await expect(menuNamed(page, "Share")).toBeVisible()
  })
})

test.describe("positioning", () => {
  test.beforeEach(({ fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet isn't placed against its trigger.")
  })

  test("the menu opens below the trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    const menu = (await menuNamed(page, "File").boundingBox())!
    const anchor = (await trigger.boundingBox())!
    expect(menu.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
  })

  test("the menu flips above the trigger when there is no room below", async ({ page, open }) => {
    await open("menu", { layout: "bottom" })
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    const menu = (await menuNamed(page, "File").boundingBox())!
    const anchor = (await trigger.boundingBox())!
    expect(menu.y + menu.height).toBeLessThanOrEqual(anchor.y + 1)
  })

  test("submenus open to the side and flip when there is no room", async ({ page, open }) => {
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    let parent = (await menuNamed(page, "File").boundingBox())!
    let child = (await menuNamed(page, "Share").boundingBox())!
    expect(child.x).toBeGreaterThanOrEqual(parent.x + parent.width - 8)

    await open("menu", { layout: "right" })
    await page.getByRole("button", { name: "File" }).click()
    await page.getByRole("menuitem", { name: "Share" }).hover()
    parent = (await menuNamed(page, "File").boundingBox())!
    child = (await menuNamed(page, "Share").boundingBox())!
    expect(child.x + child.width).toBeLessThanOrEqual(parent.x + 8)
  })
})

test.describe("animation", () => {
  test("the popup stays mounted while it animates out", async ({ page, open }) => {
    await open("menu", { animate: "" })
    await page.getByRole("button", { name: "File" }).click()
    const menu = menuNamed(page, "File")
    await expect(menu).toBeVisible()
    await expect(menu).not.toHaveAttribute("data-starting-style")

    await page.getByRole("button", { name: "File" }).click()
    await expect(page.locator("[data-ending-style]")).toHaveCount(1)
    await expect(page.getByRole("menu")).toHaveCount(0)
  })
})
