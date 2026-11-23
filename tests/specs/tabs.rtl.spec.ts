import { coversTab, expect, panelNamed, tabNamed, test } from "../fixtures"

// Right-to-left layouts mirror the horizontal arrows.

test.beforeEach(async ({ open }) => {
  await open("tabs", { dir: "rtl" })
})

test("ArrowLeft moves to the next tab and ArrowRight to the previous one", async ({
  page,
  tab,
}) => {
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(tabNamed(page, "Account")).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(tabNamed(page, "Password")).toBeFocused()
  await expect(panelNamed(page, "Password")).toBeVisible()
  await page.keyboard.press("ArrowRight")
  await expect(tabNamed(page, "Account")).toBeFocused()
})

test("the indicator covers the selected tab", async ({ page }) => {
  await tabNamed(page, "Notifications").click()
  await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
})

test("the indicator follows the selected tab when the direction changes", async ({
  page,
}) => {
  await tabNamed(page, "Notifications").click()
  await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[dir=rtl]")) {
      el.setAttribute("dir", "ltr")
    }
  })
  await expect.poll(() => coversTab(page, "Notifications")).toBe(true)
})

test("the activation direction follows the screen", async ({ page }) => {
  await tabNamed(page, "Notifications").click()
  await expect(page.getByRole("tablist")).toHaveAttribute(
    "data-activation-direction",
    "left"
  )
})

test.describe("a list that scrolls", () => {
  test.beforeEach(async ({ page }) => {
    await page.getByRole("tablist").evaluate((list) => {
      list.style.cssText += ";display:flex;width:180px;overflow-x:auto"
      for (const tab of list.querySelectorAll<HTMLElement>("[role=tab]")) {
        tab.style.cssText += ";flex:none;width:120px;box-sizing:border-box"
      }
    })
  })

  const shown = (page: Parameters<typeof tabNamed>[0], name: string) =>
    tabNamed(page, name).evaluate((tab) => {
      const list = tab
        .closest<HTMLElement>("[role=tablist]")!
        .getBoundingClientRect()
      const box = tab.getBoundingClientRect()
      return box.left >= list.left - 1 && box.right <= list.right + 1
    })

  test("a click on a half-hidden tab scrolls all of it into view", async ({
    page,
  }) => {
    expect(await shown(page, "Password")).toBe(false)
    await tabNamed(page, "Password").click({ position: { x: 110, y: 10 } })
    await expect.poll(() => shown(page, "Password")).toBe(true)
  })

  test("a half-hidden tab past a scrolled list scrolls into view", async ({
    page,
  }) => {
    await page.getByRole("tablist").evaluate((list) => {
      list.scrollLeft = -150
    })
    const name = await page.evaluate(() => {
      const list = document.querySelector<HTMLElement>("[role=tablist]")!
      const edge = list.getBoundingClientRect()
      const half = [...list.querySelectorAll<HTMLElement>("[role=tab]")].find(
        (tab) => {
          const box = tab.getBoundingClientRect()
          return (
            !tab.hasAttribute("data-disabled") &&
            box.right > edge.left + 5 &&
            box.left < edge.right - 5 &&
            (box.left < edge.left - 1 || box.right > edge.right + 1)
          )
        }
      )
      return half?.textContent?.trim() ?? ""
    })
    expect(name).not.toBe("")
    await tabNamed(page, name).click({ position: { x: 110, y: 10 } })
    await expect.poll(() => shown(page, name)).toBe(true)
  })
})
