import type { Page } from "@playwright/test"
import { entered, expect, lastAction, test } from "../fixtures"

// A tooltip shows a short text about its trigger while the pointer rests on
// it or keyboard focus is on it, following the WAI-ARIA tooltip pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
// It never takes focus, Escape closes it, and the pointer can move onto it
// (WCAG 1.4.13). Tooltips are found by their text, which works
// whether or not they have a role.

const save = (page: Page) => page.getByRole("button", { name: "Save", exact: true })
const saveTip = (page: Page) => page.getByText("Save your changes")
const before = (page: Page) => page.getByRole("button", { name: "Before" })
const profile = (page: Page) => page.getByRole("button", { name: "Profile" })
const popover = (page: Page) => page.getByRole("dialog", { name: "Profile settings" })

// Moves the pointer onto an element, without the instant jump that skips pointerenter in some engines.
async function hover(page: Page, name: string) {
  await page.getByRole("button", { name, exact: true }).hover()
}

// Moves the pointer somewhere empty.
async function moveAway(page: Page) {
  await page.mouse.move(5, 5, { steps: 4 })
}

// Moves focus with the keyboard, so it counts as keyboard focus.
async function tabTo(page: Page, tab: () => Promise<void>, name: string) {
  for (let step = 0; step < 12; step++) {
    await tab()
    if (await page.getByRole("button", { name, exact: true }).evaluate((el) => el === document.activeElement))
      return
  }
  throw new Error(`Tab never reached ${name}.`)
}

// Fake timers, so a check that nothing happens runs the time ahead instead of waiting it out.
test.beforeEach(async ({ page, open }) => {
  await page.clock.install()
  await open("tooltip")
})

test.describe("pointer", () => {
  test("resting the pointer on the trigger opens the tooltip", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
  })

  test("the tooltip waits for its delay before opening", async ({ page, open }) => {
    await open("tooltip", { delay: "400" })
    const start = Date.now()
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    expect(Date.now() - start).toBeGreaterThanOrEqual(400)
  })

  test("leaving the trigger before the delay keeps the tooltip closed", async ({ page, open }) => {
    await open("tooltip", { delay: "300" })
    await hover(page, "Save")
    await moveAway(page)
    await page.clock.runFor(450)
    await expect(saveTip(page)).toBeHidden()
  })

  test("moving the pointer away closes the tooltip", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await moveAway(page)
    await expect(saveTip(page)).toBeHidden()
  })

  test("the pointer can move onto the tooltip without closing it", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    const box = (await saveTip(page).boundingBox())!
    await page.mouse.move(box.x + 10, box.y + box.height / 2, { steps: 8 })
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeVisible()
  })

  test("opening on hover leaves focus where it was", async ({ page }) => {
    await before(page).focus()
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await expect(before(page)).toBeFocused()
  })

  test("pressing the trigger closes the tooltip and runs the button", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await save(page).click()
    await expect(saveTip(page)).toBeHidden()
    await expect(page.getByRole("status", { name: "Last action" })).toHaveText("save")
  })

  test("after a press, the tooltip stays closed until the pointer comes back", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await save(page).click()
    await expect(saveTip(page)).toBeHidden()
    const box = (await save(page).boundingBox())!
    await page.mouse.move(box.x + 4, box.y + 4, { steps: 4 })
    await page.clock.runFor(300)
    await expect(saveTip(page)).toBeHidden()
    await moveAway(page)
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
  })
})

test.describe("keyboard", () => {
  test("keyboard focus on the trigger opens the tooltip", async ({ page, tab }) => {
    await before(page).focus()
    await tabTo(page, tab, "Save")
    await expect(saveTip(page)).toBeVisible()
  })

  test("focus leaving the trigger closes the tooltip", async ({ page, tab }) => {
    await before(page).focus()
    await tabTo(page, tab, "Save")
    await expect(saveTip(page)).toBeVisible()
    await tab()
    await expect(saveTip(page)).toBeHidden()
  })

  test("Escape closes the tooltip and leaves focus on the trigger", async ({ page, tab }) => {
    await before(page).focus()
    await tabTo(page, tab, "Save")
    await expect(saveTip(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(saveTip(page)).toBeHidden()
    await expect(save(page)).toBeFocused()
  })

  test("Escape closes a tooltip opened by hover", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(saveTip(page)).toBeHidden()
  })

  test("Tab through the toolbar shows each tooltip in turn", async ({ page, tab }) => {
    await save(page).focus()
    await tab()
    await tab()
    await expect(page.getByText("Italic", { exact: true })).toBeVisible()
    await expect(page.locator(".tooltip:visible")).toHaveCount(1)
  })

  test("a click that focuses the trigger doesn't open the tooltip from focus", async ({ page, open }) => {
    await open("tooltip", { delay: "2000" })
    await save(page).click()
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeHidden()
  })
})

test.describe("several tooltips", () => {
  test("only one tooltip is open at a time", async ({ page }) => {
    await hover(page, "Bold")
    await expect(page.getByText("Bold", { exact: true })).toBeVisible()
    await hover(page, "Italic")
    await expect(page.getByText("Italic", { exact: true })).toBeVisible()
    await expect(page.getByText("Bold", { exact: true })).toBeHidden()
  })

  test("once the pointer has been away a while, the delay applies again", async ({ page, open }) => {
    await open("tooltip", { delay: "600" })
    await hover(page, "Bold")
    await expect(page.getByText("Bold", { exact: true })).toBeVisible()
    await moveAway(page)
    await expect(page.getByText("Bold", { exact: true })).toBeHidden()
    await page.clock.runFor(800)
    await hover(page, "Italic")
    await page.clock.runFor(200)
    await expect(page.getByText("Italic", { exact: true })).toBeHidden()
  })
})

test.describe("positioning", () => {
  test("the tooltip opens above the trigger", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    const tip = (await saveTip(page).boundingBox())!
    const anchor = (await save(page).boundingBox())!
    expect(tip.y + tip.height).toBeLessThanOrEqual(anchor.y + 1)
  })

  test("the tooltip flips below the trigger when there is no room above", async ({ page, open }) => {
    await open("tooltip", { layout: "top" })
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    const tip = (await saveTip(page).boundingBox())!
    const anchor = (await save(page).boundingBox())!
    expect(tip.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
  })

  test("the tooltip opens on the requested side", async ({ page, open }) => {
    await open("tooltip", { side: "bottom" })
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    const tip = (await saveTip(page).boundingBox())!
    const anchor = (await save(page).boundingBox())!
    expect(tip.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
  })

  test("the arrow points at the middle of the trigger", async ({ page }) => {
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    const arrow = (await page.locator(".tooltip .arrow").boundingBox())!
    const anchor = (await save(page).boundingBox())!
    expect(Math.abs(arrow.x + arrow.width / 2 - (anchor.x + anchor.width / 2))).toBeLessThanOrEqual(1)
  })
})

test.describe("a tooltip on a popover trigger", () => {
  const profile = (page: Page) => page.getByRole("button", { name: "Profile" })
  const profileTip = (page: Page) => page.getByText("Edit your profile")

  test("hovering shows the tooltip, and pressing opens the popover instead", async ({ page }) => {
    await hover(page, "Profile")
    await expect(profileTip(page)).toBeVisible()
    await profile(page).click()
    await expect(page.getByRole("dialog", { name: "Profile settings" })).toBeVisible()
    await expect(profileTip(page)).toBeHidden()
  })

  test("Escape closes the tooltip and leaves the popover open", async ({ page }) => {
    await profile(page).click()
    await expect(page.getByRole("dialog", { name: "Profile settings" })).toBeVisible()
    await hover(page, "Help")
    await expect(page.getByText("Opens the help center")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByText("Opens the help center")).toBeHidden()
    await expect(page.getByRole("dialog", { name: "Profile settings" })).toBeVisible()
  })
})

test.describe("disabled buttons", () => {
  // Disabled form controls get hover events in every engine now, but no
  // focus and no presses. The recipe keeps the button focusable instead.
  test("browsers send hover events to a disabled button", async ({ page }) => {
    const events = await page.evaluate(async () => {
      const button = document.createElement("button")
      button.disabled = true
      button.textContent = "Disabled"
      button.style.cssText = "position: fixed; left: 300px; top: 300px; width: 80px; height: 30px"
      document.body.append(button)
      const seen: string[] = []
      for (const type of ["pointerenter", "pointerleave", "mouseenter", "click"])
        button.addEventListener(type, () => seen.push(type))
      ;(window as unknown as { seen: string[] }).seen = seen
      return seen
    })
    expect(events).toEqual([])
    await page.mouse.move(340, 315, { steps: 4 })
    await page.mouse.down()
    await page.mouse.up()
    await page.mouse.move(5, 5, { steps: 4 })
    const seen = await page.evaluate(() => (window as unknown as { seen: string[] }).seen)
    expect(seen).toEqual(["pointerenter", "mouseenter", "pointerleave"])
  })

  test("an aria-disabled trigger shows its tooltip on hover and focus and ignores presses", async ({
    page,
    open,
    tab,
  }) => {
    await open("tooltip", { disabled: "" })
    const publish = page.getByRole("button", { name: "Publish" })
    await hover(page, "Publish")
    await expect(page.getByText("Add a title to publish")).toBeVisible()
    await publish.click({ force: true })
    await expect(page.getByRole("status", { name: "Last action" })).toHaveText("")
    await moveAway(page)
    await page.getByRole("button", { name: "About billing" }).focus()
    await tabTo(page, tab, "Publish")
    await expect(page.getByText("Add a title to publish")).toBeVisible()
  })
})

test.describe("animation", () => {
  test("the tooltip stays in the page while it animates out", async ({ page, open }) => {
    await open("tooltip", { animate: "" })
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await entered(page)
    await moveAway(page)
    await expect(page.locator("[data-ending-style]")).toHaveCount(1)
    await expect(saveTip(page)).toBeHidden()
  })
})

test.describe("hidden while closed", () => {
  test("a class that sets display on the content doesn't show it while closed", async ({ page }) => {
    await page.addStyleTag({ content: ".tooltip { display: flex }" })
    await expect(saveTip(page)).toBeHidden()
    await hover(page, "Save")
    await expect(saveTip(page)).toBeVisible()
    await moveAway(page)
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeHidden()
  })
})

test.describe("options and dismissal", () => {
  test("Escape closes only a tooltip that keyboard focus opened inside a popover", async ({ page, tab }) => {
    await profile(page).click()
    await expect(popover(page)).toBeVisible()
    await page.getByRole("button", { name: "Help" }).focus()
    await tab()
    await tab({ shift: true })
    await expect(page.getByRole("button", { name: "Help" })).toBeFocused()
    await expect(page.getByText("Opens the help center")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByText("Opens the help center")).toBeHidden()
    await expect(popover(page)).toBeVisible()
  })

  test("the pointer can leave the trigger sideways on its way to the tooltip", async ({ page }) => {
    await save(page).hover()
    await expect(saveTip(page)).toBeVisible()
    const trigger = (await save(page).boundingBox())!
    const tip = (await saveTip(page).boundingBox())!
    // Out through the trigger's left edge, then up into the tooltip's left part.
    await page.mouse.move(trigger.x - 2, trigger.y + 4, { steps: 3 })
    await page.mouse.move(tip.x + 4, tip.y + tip.height / 2, { steps: 3 })
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeVisible()
  })

  test("with closeOnPress false, pressing the trigger keeps the tooltip open", async ({ page, open }) => {
    await open("tooltip", { closeOnPress: "false" })
    await save(page).hover()
    await expect(saveTip(page)).toBeVisible()
    await save(page).click()
    expect(await lastAction(page)).toBe("save")
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeVisible()
  })

  test("disabled tooltips never open", async ({ page, open, tab }) => {
    await open("tooltip", { "disabled-tooltips": "" })
    await save(page).hover()
    await page.getByRole("button", { name: "Before" }).focus()
    await tab()
    await page.clock.runFor(300)
    await expect(saveTip(page)).toBeHidden()
  })

  test("a tap on a plain tooltip's trigger only presses it", async ({ browser, framework, baseURL }) => {
    const context = await browser.newContext({ hasTouch: true, isMobile: true, baseURL })
    const page = await context.newPage()
    await page.clock.install()
    await page.goto(`/?fixture=tooltip&framework=${framework}&delay=0`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await save(page).tap()
    expect(await lastAction(page)).toBe("save")
    await page.clock.runFor(200)
    await expect(saveTip(page)).toBeHidden()
    await context.close()
  })
})
