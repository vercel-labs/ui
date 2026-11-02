import type { Locator, Page } from "@playwright/test"
import { entered, expect, lastAction, pageNow, test } from "../fixtures"

// Site navigation with the APG disclosure navigation pattern: buttons that
// show panels of links inside a <nav>, not a menu. Tab reaches every trigger
// and link, Enter and Space toggle a panel, Escape closes it, and the pointer
// opens panels by resting on their triggers.

const trigger = (page: Page, name: string) => page.getByRole("button", { name, exact: true })
const link = (page: Page, name: string) => page.getByRole("link", { name, exact: true })
const before = (page: Page) => page.getByRole("button", { name: "Before" })
const after = (page: Page) => page.getByRole("button", { name: "After" })
const viewport = (page: Page) => page.locator(".nav-viewport")

// Moves the pointer onto an element without waiting for it to take pointer
// events, since a menu may route them elsewhere while the pointer crosses.
async function pointAt(page: Page, target: Locator) {
  const box = (await target.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 })
}

async function moveAway(page: Page) {
  await page.mouse.move(5, 300, { steps: 4 })
}

test.beforeEach(async ({ open }) => {
  await open("navigation-menu")
})

test.describe("pointer", () => {
  test("resting the pointer on a trigger opens its panel", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await expect(trigger(page, "Products")).toHaveAttribute("aria-expanded", "true")
  })

  test("the panel waits for its delay before opening", async ({ page, open }) => {
    await open("navigation-menu", { delay: "400" })
    const start = await pageNow(page)
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    expect((await pageNow(page)) - start).toBeGreaterThanOrEqual(400)
  })

  test("moving to another trigger while a panel is open switches at once", async ({ page, open }) => {
    await open("navigation-menu", { delay: "600" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    const start = await pageNow(page)
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    expect((await pageNow(page)) - start).toBeLessThan(500)
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("moving the pointer away closes the panel after its close delay", async ({ page, open }) => {
    await open("navigation-menu", { closeDelay: "400" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    const start = await pageNow(page)
    await moveAway(page)
    await expect(link(page, "Analytics")).toBeHidden()
    expect((await pageNow(page)) - start).toBeGreaterThanOrEqual(400)
  })

  test("moving the pointer into the panel keeps it open", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    const box = (await link(page, "Security").boundingBox())!
    await page.mouse.move(box.x + 4, box.y + box.height / 2, { steps: 8 })
    await page.waitForTimeout(300)
    await expect(link(page, "Security")).toBeVisible()
  })

  test("opening on hover leaves focus where it was", async ({ page }) => {
    await before(page).focus()
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await expect(before(page)).toBeFocused()
  })

  test("clicking a trigger opens its panel, and clicking it again closes it", async ({ page, open }) => {
    await open("navigation-menu", { delay: "2000" })
    await trigger(page, "Products").click()
    await expect(link(page, "Analytics")).toBeVisible()
    await trigger(page, "Products").click()
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("clicking a trigger the pointer just opened keeps it open", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await trigger(page, "Products").click()
    await page.waitForTimeout(200)
    await expect(link(page, "Analytics")).toBeVisible()
  })

  test("a press outside closes the panel", async ({ page, open }) => {
    await open("navigation-menu", { delay: "2000" })
    await trigger(page, "Products").click()
    await expect(link(page, "Analytics")).toBeVisible()
    await page.mouse.click(5, 300)
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("a tap opens a panel and another tap closes it", async ({ browser, framework, baseURL }) => {
    const context = await browser.newContext({ hasTouch: true, isMobile: true, baseURL })
    const page = await context.newPage()
    await page.goto(`/?fixture=navigation-menu&framework=${framework}`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await trigger(page, "Products").tap()
    await expect(link(page, "Analytics")).toBeVisible()
    await trigger(page, "Products").tap()
    await expect(link(page, "Analytics")).toBeHidden()
    await context.close()
  })

  test("Escape closes a panel the pointer opened, which stays closed while the pointer rests", async ({
    page,
  }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(link(page, "Analytics")).toBeHidden()
    const box = (await trigger(page, "Products").boundingBox())!
    await page.mouse.move(box.x + box.width / 2 + 3, box.y + box.height / 2, { steps: 3 })
    await page.waitForTimeout(300)
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("sweeping across every trigger leaves the menu working", async ({ page }) => {
    const first = (await trigger(page, "Products").boundingBox())!
    const last = (await link(page, "Pricing").boundingBox())!
    const y = first.y + first.height / 2
    for (let pass = 0; pass < 3; pass++) {
      await page.mouse.move(first.x - 10, y)
      await page.mouse.move(last.x + last.width + 10, y, { steps: 6 })
    }
    await moveAway(page)
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    await link(page, "Blog").click()
    await expect(page).toHaveURL(/#blog$/)
  })
})

test.describe("keyboard", () => {
  test("Tab moves through the triggers and links in order while closed", async ({ page, tab }) => {
    await before(page).focus()
    for (const name of ["Products", "Resources"]) {
      await tab()
      await expect(trigger(page, name)).toBeFocused()
    }
    await tab()
    await expect(link(page, "Pricing")).toBeFocused()
    await tab()
    await expect(after(page)).toBeFocused()
  })

  test("Enter opens a panel and leaves focus on its trigger", async ({ page }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Analytics")).toBeVisible()
    await expect(trigger(page, "Products")).toBeFocused()
    expect(await lastAction(page)).toBe("products: trigger-press")
  })

  test("Space toggles a panel", async ({ page }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press(" ")
    await expect(link(page, "Analytics")).toBeVisible()
    await page.keyboard.press(" ")
    await expect(link(page, "Analytics")).toBeHidden()
    await expect(trigger(page, "Products")).toBeFocused()
  })

  test("Enter on another trigger switches panels", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Analytics")).toBeVisible()
    await trigger(page, "Resources").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Blog")).toBeVisible()
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("Tab from an open trigger moves into its panel", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Analytics")).toBeVisible()
    await tab()
    await expect(link(page, "Analytics")).toBeFocused()
    await tab()
    await expect(link(page, "Engagement")).toBeFocused()
  })

  test("Tab past the panel's last link moves on to the next trigger", async ({ page, tab }) => {
    await trigger(page, "Resources").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Blog")).toBeVisible()
    await tab()
    await expect(link(page, "Blog")).toBeFocused()
    await tab()
    await expect(link(page, "Guides")).toBeFocused()
    await tab()
    await expect(link(page, "Pricing")).toBeFocused()
  })

  test("Shift+Tab from the panel's first link returns to its trigger", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await tab()
    await expect(link(page, "Analytics")).toBeFocused()
    await tab({ shift: true })
    await expect(trigger(page, "Products")).toBeFocused()
    await expect(link(page, "Analytics")).toBeVisible()
  })

  test("Shift+Tab from the item after an open panel goes back into the panel", async ({ page, tab }) => {
    await trigger(page, "Resources").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Blog")).toBeVisible()
    await link(page, "Pricing").focus()
    await tab({ shift: true })
    await expect(link(page, "Guides")).toBeFocused()
  })

  test("Escape inside a panel closes it and returns focus to its trigger", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await tab()
    await expect(link(page, "Analytics")).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(link(page, "Analytics")).toBeHidden()
    await expect(trigger(page, "Products")).toBeFocused()
    expect(await lastAction(page)).toBe("close: escape-key")
  })

  test("Escape on an open trigger closes its panel", async ({ page }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Analytics")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(link(page, "Analytics")).toBeHidden()
    await expect(trigger(page, "Products")).toBeFocused()
  })

  test("focus leaving the navigation closes the panel", async ({ page, tab }) => {
    await trigger(page, "Resources").focus()
    await page.keyboard.press("Enter")
    await expect(link(page, "Blog")).toBeVisible()
    await tab({ shift: true })
    await tab({ shift: true })
    await expect(before(page)).toBeFocused()
    await expect(link(page, "Blog")).toBeHidden()
    expect(await lastAction(page)).toBe("close: focus-out")
  })

  test("Right and Left arrows move between the top-level items", async ({ page }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("ArrowRight")
    await expect(trigger(page, "Resources")).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(link(page, "Pricing")).toBeFocused()
    await page.keyboard.press("ArrowLeft")
    await expect(trigger(page, "Resources")).toBeFocused()
  })

  test("arrows stop at the first and last items", async ({ page }) => {
    await link(page, "Pricing").focus()
    await page.keyboard.press("ArrowRight")
    await expect(link(page, "Pricing")).toBeFocused()
    await trigger(page, "Products").focus()
    await page.keyboard.press("ArrowLeft")
    await expect(trigger(page, "Products")).toBeFocused()
  })

  test("ArrowDown on a trigger opens its panel", async ({ page }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("ArrowDown")
    await expect(link(page, "Analytics")).toBeVisible()
  })

  test("Down and Up arrows move between the links in a panel", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await tab()
    await expect(link(page, "Analytics")).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await expect(link(page, "Engagement")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(link(page, "Analytics")).toBeFocused()
  })

  test("an editable element in a panel keeps Down, and a tab stop that isn't editable passes it on", async ({
    page,
    tab,
  }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await tab()
    await expect(link(page, "Analytics")).toBeFocused()
    for (const [value, editable] of [
      ["true", true],
      ["inherit", false],
      ["False", false],
    ] as const) {
      await link(page, "Analytics").evaluate((el, value) => {
        const note = document.createElement("span")
        note.id = "note"
        note.tabIndex = 0
        note.textContent = "Note"
        note.setAttribute("contenteditable", value)
        el.before(note)
      }, value)
      const note = page.locator("#note")
      await note.focus()
      await page.keyboard.press("ArrowDown")
      await expect(editable ? note : link(page, "Analytics")).toBeFocused()
      await note.evaluate((el) => el.remove())
    }
  })

  test("a vertical menu moves between items with Down and Up", async ({ page, open }) => {
    await open("navigation-menu", { orientation: "vertical" })
    await trigger(page, "Products").focus()
    await page.keyboard.press("ArrowDown")
    await expect(trigger(page, "Resources")).toBeFocused()
    await page.keyboard.press("ArrowUp")
    await expect(trigger(page, "Products")).toBeFocused()
  })
})

test.describe("links", () => {
  test("a link in a panel follows its href and closes the menu", async ({ page }) => {
    await trigger(page, "Products").click()
    await link(page, "Engagement").click()
    await expect(page).toHaveURL(/#engagement$/)
    await expect(link(page, "Engagement")).toBeHidden()
    expect(await lastAction(page)).toBe("close: link-press")
  })

  test("Enter on a link follows it", async ({ page, tab }) => {
    await trigger(page, "Products").focus()
    await page.keyboard.press("Enter")
    await tab()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#analytics$/)
  })

  test("a link with closing turned off leaves the menu open", async ({ page, open }) => {
    await open("navigation-menu", { "close-on-select": "false" })
    await trigger(page, "Products").click()
    await link(page, "Engagement").click()
    await expect(page).toHaveURL(/#engagement$/)
    await expect(link(page, "Engagement")).toBeVisible()
  })

  test("the current page's link says so", async ({ page }) => {
    await expect(link(page, "Pricing")).toHaveAttribute("aria-current", "page")
    await expect(link(page, "Pricing")).toHaveAttribute("data-active", "")
  })
})

test.describe("viewport", () => {
  test("the viewport opens below the open trigger, lined up with its start", async ({ page }) => {
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    const box = (await viewport(page).boundingBox())!
    const anchor = (await trigger(page, "Resources").boundingBox())!
    expect(box.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
    expect(Math.abs(box.x - anchor.x)).toBeLessThanOrEqual(1)
  })

  test("the viewport takes the open panel's size", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await expect(async () => {
      const box = (await viewport(page).boundingBox())!
      expect(Math.round(box.width)).toBe(322)
    }).toPass()
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    await expect(async () => {
      const box = (await viewport(page).boundingBox())!
      expect(Math.round(box.width)).toBe(202)
    }).toPass()
  })

  test("the viewport moves to the newly open trigger", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    const anchor = (await trigger(page, "Resources").boundingBox())!
    await expect(async () => {
      const box = (await viewport(page).boundingBox())!
      expect(Math.abs(box.x - anchor.x)).toBeLessThanOrEqual(1)
    }).toPass()
  })
})

test.describe("kept content", () => {
  test("closed content kept mounted stays in the page, hidden", async ({ page, open }) => {
    await open("navigation-menu", { "keep-mounted": "" })
    await expect(page.locator('a[href="#engagement"]')).toHaveCount(1)
    await expect(page.locator('a[href="#engagement"]')).toBeHidden()
    await trigger(page, "Products").hover()
    await expect(link(page, "Engagement")).toBeVisible()
  })

  test("the viewport follows the open panel when its size changes", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await page.locator(".nav-content", { has: link(page, "Analytics") }).evaluate((el) => {
      ;(el as HTMLElement).style.width = "400px"
    })
    await expect(async () => {
      const box = (await viewport(page).boundingBox())!
      expect(Math.round(box.width)).toBe(402)
    }).toPass()
  })
})

test.describe("animation", () => {
  // The fixture turns its transitions off for reduced motion, which a machine's setting can ask for.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
  })

  test("the viewport stays in the page while it animates out", async ({ page, open }) => {
    await open("navigation-menu", { animate: "", closeDelay: "0" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await entered(page)
    await moveAway(page)
    await expect(page.locator(".nav-viewport[data-ending-style]")).toHaveCount(1)
    await expect(link(page, "Analytics")).toBeHidden()
  })

  test("a menu opening from closed has no motion", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await expect(page.locator(".nav-content", { has: link(page, "Analytics") })).not.toHaveAttribute(
      "data-motion",
    )
  })

  test("with reduced motion, panels switch and close without waiting", async ({ page, open }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await open("navigation-menu", { animate: "", closeDelay: "0" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    await expect(page.locator(".nav-content:visible")).toHaveCount(1)
    await moveAway(page)
    await expect(viewport(page)).toBeHidden()
    await expect(page.locator("[data-ending-style]")).toHaveCount(0)
  })

  test("the viewport appears in place, without sliding in from the corner", async ({ page, open }) => {
    await open("navigation-menu", { animate: "" })
    await trigger(page, "Resources").hover()
    await expect(viewport(page)).toBeVisible()
    const box = (await viewport(page).boundingBox())!
    const anchor = (await trigger(page, "Resources").boundingBox())!
    expect(Math.abs(box.x - anchor.x)).toBeLessThanOrEqual(1)
  })

  test("exit keyframes keyed on data-closed play on the content that gave way", async ({ page }) => {
    await page.addStyleTag({
      content: "@keyframes exit { to { opacity: 0 } } .nav-content[data-closed] { animation: exit 3s }",
    })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    const exiting = page.locator(".nav-content[data-closed][data-ending-style]")
    await expect(exiting).toHaveCount(1)
    expect(
      await exiting.evaluate((el) =>
        el.getAnimations().some((animation) => (animation as CSSAnimation).animationName === "exit"),
      ),
    ).toBe(true)
  })

  test("the content that gave way animates out while the next one comes in", async ({ page, open }) => {
    await open("navigation-menu", { animate: "" })
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    // A content leaving before it finished coming in reverses its entrance, which is shorter.
    await page.waitForFunction(() => document.getAnimations().length === 0)
    await pointAt(page, trigger(page, "Resources"))
    await expect(page.locator(".nav-content[data-ending-style]")).toHaveCount(1)
    await expect(link(page, "Analytics")).toBeHidden()
    await expect(link(page, "Blog")).toBeVisible()
  })
})

test.describe("reasons", () => {
  test("changes report why the menu opened, switched and closed", async ({ page }) => {
    await trigger(page, "Products").hover()
    await expect(link(page, "Analytics")).toBeVisible()
    expect(await lastAction(page)).toBe("products: trigger-hover")
    await pointAt(page, trigger(page, "Resources"))
    await expect(link(page, "Blog")).toBeVisible()
    expect(await lastAction(page)).toBe("resources: trigger-hover")
    await page.keyboard.press("Escape")
    await expect(link(page, "Blog")).toBeHidden()
    expect(await lastAction(page)).toBe("close: escape-key")
  })
})

test.describe("nested", () => {
  test.beforeEach(async ({ open }) => {
    await open("navigation-menu", { nested: "", delay: "2000" })
  })

  test("a menu inside a panel opens its own panel", async ({ page }) => {
    await trigger(page, "Resources").click()
    await trigger(page, "Learn").click()
    await expect(link(page, "Tutorials")).toBeVisible()
    await expect(link(page, "Blog")).toBeVisible()
  })

  test("a link in a nested panel closes every menu", async ({ page }) => {
    await trigger(page, "Resources").click()
    await trigger(page, "Learn").click()
    await link(page, "Courses").click()
    await expect(page).toHaveURL(/#courses$/)
    await expect(link(page, "Courses")).toBeHidden()
    await expect(link(page, "Blog")).toBeHidden()
  })
})
