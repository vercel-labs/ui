import { expect, menuNamed, test } from "../fixtures"

// Web component menus: what markup and properties set after the elements
// upgrade, as a script would.

test.beforeEach(({ framework }) => {
  test.skip(
    !framework.startsWith("web"),
    "Only web components read these from attributes and properties."
  )
})

test("an item's shortcut glyph follows its shortcut attribute", async ({
  page,
  open,
}) => {
  await open("menu")
  const item = page.locator('ui-menu-item[value="new"]')
  const before = await item.locator("ui-menu-shortcut").textContent()
  await item.evaluate((el) => el.setAttribute("shortcut", "mod+j"))
  await expect(item.locator("ui-menu-shortcut")).toHaveCount(1)
  await expect(item.locator("ui-menu-shortcut")).not.toHaveText(before!)
  await expect(item.locator("ui-menu-shortcut")).toHaveText(/J/)
  await item.evaluate((el) => el.removeAttribute("shortcut"))
  await expect(item.locator("ui-menu-shortcut")).toHaveCount(0)
})

test("a data radio group with a null value stays controlled with nothing selected", async ({
  page,
  open,
}) => {
  await open("menu")
  await page.evaluate(() => {
    const menu = document.createElement("ui-menu") as HTMLElement &
      Record<string, any>
    menu.innerHTML = `<ui-menu-trigger><button>Sort</button></ui-menu-trigger>`
    document.body.append(menu)
    menu.items = [
      {
        type: "radio-group",
        name: "sort",
        value: null,
        items: [
          { value: "name", label: "Name" },
          { value: "date", label: "Date" },
        ],
      },
    ]
  })
  await page.getByRole("button", { name: "Sort" }).click()
  await expect(menuNamed(page, "Sort")).toBeVisible()
  await page.getByRole("menuitemradio", { name: "Name" }).click()
  await expect(
    page.getByRole("menuitemradio", { name: "Date" })
  ).toHaveAttribute("aria-checked", "false")
  await expect(
    page.getByRole("menuitemradio", { name: "Name" })
  ).toHaveAttribute("aria-checked", "false")
})

test('modal="trap-focus" on a menu reads as a bare modal, which menus take', async ({
  page,
  open,
}) => {
  await open("menu")
  await page.evaluate(() =>
    document.querySelector("ui-menu")!.setAttribute("modal", "trap-focus")
  )
  await page.getByRole("button", { name: "File" }).click()
  await expect(menuNamed(page, "File")).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.style.overflow)
  ).toBe("hidden")
})
