import { expect, menuNamed, test } from "../fixtures"

// Right-to-left layouts mirror the horizontal arrows and submenu placement.

test.beforeEach(async ({ open }) => {
  await open("menu", { dir: "rtl" })
})

test(
  "the menu lines up with the trigger's right edge",
  { tag: "@enhancement" },
  async ({ page }) => {
    const trigger = page.getByRole("button", { name: "File" })
    await trigger.click()
    const menu = (await menuNamed(page, "File").boundingBox())!
    const anchor = (await trigger.boundingBox())!
    expect(
      Math.abs(menu.x + menu.width - (anchor.x + anchor.width))
    ).toBeLessThanOrEqual(1)
  }
)

test("ArrowLeft opens a submenu and ArrowRight closes it", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).focus()
  await page.keyboard.press("Enter")
  await page.keyboard.type("sha")
  await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByRole("menuitem", { name: "Email" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(menuNamed(page, "Share")).toBeHidden()
  await expect(page.getByRole("menuitem", { name: "Share" })).toBeFocused()
})

test("submenus open to the left", async ({ page }) => {
  await page.getByRole("button", { name: "File" }).click()
  await page.getByRole("menuitem", { name: "Share" }).hover()
  await expect(menuNamed(page, "Share")).toBeVisible()
  const parent = (await menuNamed(page, "File").boundingBox())!
  const child = (await menuNamed(page, "Share").boundingBox())!
  expect(child.x + child.width).toBeLessThanOrEqual(parent.x + 8)
})

test("moving diagonally toward a submenu on the left keeps it open", async ({
  page,
}) => {
  await page.getByRole("button", { name: "File" }).click()
  const share = page.getByRole("menuitem", { name: "Share" })
  await share.hover()
  await expect(menuNamed(page, "Share")).toBeVisible()
  const from = (await share.boundingBox())!
  const to = (await page.getByRole("menuitem", { name: "More" }).boundingBox())!
  await page.mouse.move(from.x + 12, from.y + from.height / 2)
  await page.mouse.move(to.x + to.width - 12, to.y + to.height / 2, {
    steps: 12,
  })
  await expect(menuNamed(page, "Share")).toBeVisible()
  await expect(page.getByRole("menuitem", { name: "More" })).toHaveAttribute(
    "data-highlighted",
    ""
  )
})

test(
  "shortcut hints keep their left-to-right order",
  { tag: "@enhancement" },
  async ({ page }) => {
    // Apple glyphs are all neutral characters, so they show the problem.
    await page.addInitScript(() =>
      Object.defineProperty(Navigator.prototype, "platform", {
        get: () => "MacIntel",
      })
    )
    await page.reload()
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await page.getByRole("button", { name: "File" }).click()
    const hint = page
      .getByRole("menuitem", { name: "New file" })
      .locator('[data-slot="menu-shortcut"]')
    await expect(hint).toContainText("⌘N")
    // The x position of each visible character, in logical order.
    const positions = await hint.evaluate((el) => {
      const xs: number[] = []
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let i = 0; i < node.textContent!.length; i++) {
          if (/[‎‏⁦-⁩]/.test(node.textContent![i])) {
            continue
          }
          const range = document.createRange()
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          xs.push(range.getBoundingClientRect().x)
        }
      }
      return xs
    })
    expect(positions.length).toBeGreaterThan(1)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  }
)
