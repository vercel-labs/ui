import type { Page } from "@playwright/test"
import {
  dialogNamesAtFocus,
  expect,
  isSheet,
  lastAction,
  opacityOf,
  recordDialogNamesAtFocus,
  slowTransitions,
  test,
} from "../fixtures"
import { addScroller, addShadowButton, composingEscape } from "../fixtures/popup"

// The trigger is a button that opens a dialog, following the WAI-ARIA dialog
// pattern for focus inside it: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
// Non-modal popovers leave the rest of the page usable.

const dialog = (page: Page) => page.getByRole("dialog", { name: "Edit profile" })
const trigger = (page: Page) => page.getByRole("button", { name: "Profile" })

// Closing during the entrance would reverse it, which CSS shortens to how far
// it got. A sheet's held script animations never end, so only transitions count.
const transitionedIn = (page: Page) =>
  expect
    .poll(() =>
      dialog(page).evaluate(
        (el) =>
          !el.hasAttribute("data-starting-style") &&
          !el.getAnimations().some((animation) => "transitionProperty" in animation),
      ),
    )
    .toBe(true)
const field = (page: Page) => page.getByRole("textbox", { name: "Display name" })

async function openWithKeyboard(page: Page) {
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(field(page)).toBeFocused()
}

test.beforeEach(async ({ open }) => {
  await open("popover")
})

test.describe("trigger", () => {
  test("reflects the open state", async ({ page }) => {
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
    await trigger(page).click()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
  })

  test("click opens the popover", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
  })

  test("click on the open trigger closes the popover", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await trigger(page).click()
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "false")
  })

  for (const key of ["Enter", " "]) {
    test(`${key === " " ? "Space" : key} opens the popover`, async ({ page }) => {
      await trigger(page).focus()
      await page.keyboard.press(key)
      await expect(dialog(page)).toBeVisible()
    })
  }

  test("points to the popover it controls while open", async ({ page }) => {
    await trigger(page).click()
    const id = await dialog(page).getAttribute("id")
    await expect(trigger(page)).toHaveAttribute("aria-controls", id!)
  })
})

test.describe("focus", () => {
  test("opening moves focus to the first focusable element", async ({ page }) => {
    await trigger(page).click()
    await expect(field(page)).toBeFocused()
  })

  test("each time focus moves in, the popover is named by its title and described by its description", async ({
    page,
  }) => {
    await recordDialogNamesAtFocus(page)
    for (const time of [1, 2]) {
      await openWithKeyboard(page)
      await page.keyboard.press("Escape")
      await expect(trigger(page)).toBeFocused()
      expect(await dialogNamesAtFocus(page), `open ${time}`).toEqual(
        Array(time).fill("Edit profile / Your name appears on your posts."),
      )
    }
  })

  test("Tab moves through the popover in order", async ({ page, tab }) => {
    await openWithKeyboard(page)
    await tab()
    await expect(page.getByRole("button", { name: "Save" })).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused()
  })

  test("Shift+Tab from the first element returns focus to the trigger", async ({
    page,
    tab,
    fixtureOptions,
  }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    await openWithKeyboard(page)
    await tab({ shift: true })
    await expect(trigger(page)).toBeFocused()
  })

  test("Tab from the last element moves focus to the element after the trigger", async ({
    page,
    tab,
    fixtureOptions,
  }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "After" })).toBeFocused()
  })

  test("focus leaving the popover closes it", async ({ page, tab, fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(dialog(page)).toBeHidden()
  })

  test("Escape closes the popover and returns focus to the trigger", async ({ page }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("Escape after a click returns focus to the trigger", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("the close button closes the popover and returns focus to the trigger", async ({ page }) => {
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Close" }).focus()
    await page.keyboard.press("Enter")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("with initial focus none, opening leaves focus on the trigger", async ({ page, open }) => {
    await open("popover", { initialFocus: "none" })
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(dialog(page)).toBeVisible()
    await page.waitForTimeout(100)
    await expect(trigger(page)).toBeFocused()
  })

  test("a virtual click from a screen reader moves focus into the popover", async ({ page }) => {
    await trigger(page).evaluate((el) => (el as HTMLElement).click())
    await expect(field(page)).toBeFocused()
  })

  test("a touch press focuses the popover itself, so no on-screen keyboard appears", async ({
    browser,
    framework,
    baseURL,
  }) => {
    const context = await browser.newContext({ hasTouch: true, isMobile: true, baseURL })
    const page = await context.newPage()
    await page.goto(`/?fixture=popover&framework=${framework}`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await trigger(page).tap()
    await expect(dialog(page)).toBeVisible()
    await expect(dialog(page)).toBeFocused()
    await context.close()
  })

  test(
    "closing after the trigger is gone moves focus to the element after where it was",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("popover", { removable: "" })
      await openWithKeyboard(page)
      await page.getByRole("button", { name: "Remove trigger" }).click()
      await expect(trigger(page)).toHaveCount(0)
      await page.keyboard.press("Escape")
      await expect(dialog(page)).toBeHidden()
      await expect(page.getByRole("button", { name: "After" })).toBeFocused()
    },
  )

  test("pressing a button inside keeps the popover open", async ({ page }) => {
    await trigger(page).click()
    await page.getByRole("button", { name: "Save" }).click()
    expect(await lastAction(page)).toBe("save")
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("dismissal", () => {
  test("clicking outside closes the popover", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
  })

  test("clicking inside the popover keeps it open", async ({ page }) => {
    await trigger(page).click()
    await page.getByRole("heading", { name: "Edit profile" }).click()
    await expect(dialog(page)).toBeVisible()
  })

  test("an outside press reaches what it hits", async ({ page, fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    const after = page.getByRole("button", { name: "After" })
    await after.evaluate((el) => el.addEventListener("click", () => (el.dataset.clicked = "")))
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await after.click()
    await expect(dialog(page)).toBeHidden()
    await expect(after).toHaveAttribute("data-clicked")
  })

  test("a press on empty space returns focus to the trigger", async ({ page, open }) => {
    await open("popover")
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(field(page)).toBeFocused()
    await page.mouse.click(5, 300)
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test(
    "Escape while an input method is composing text leaves the popover open",
    { tag: "@enhancement" },
    async ({ page }) => {
      await openWithKeyboard(page)
      await composingEscape(page)
      await page.waitForTimeout(100)
      await expect(dialog(page)).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(dialog(page)).toBeHidden()
    },
  )

  test("pressing a scrollbar outside the popover leaves it open", async ({ page }) => {
    const scrollbar = await addScroller(page)
    test.skip(!scrollbar, "This browser hides scrollbars in automation.")
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(scrollbar!.x, scrollbar!.y)
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(scrollbar!.x - 40, scrollbar!.y)
    await expect(dialog(page)).toBeHidden()
  })

  test("pressing a button in a shadow root inside keeps the popover open", async ({ page }) => {
    await trigger(page).click()
    await addShadowButton(page.getByRole("button", { name: "Save" }))
    await page.getByRole("button", { name: "Shadow" }).click()
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
  })

  test("Tab into a button in a shadow root inside keeps the popover open", async ({ page, tab }) => {
    await openWithKeyboard(page)
    await addShadowButton(page.getByRole("button", { name: "Save" }))
    await tab()
    await expect(page.getByRole("button", { name: "Shadow" })).toBeFocused()
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
  })

  test("Escape on a button in a shadow root inside returns focus to the trigger", async ({ page }) => {
    await openWithKeyboard(page)
    await addShadowButton(page.getByRole("button", { name: "Save" }))
    await page.getByRole("button", { name: "Shadow" }).focus()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("switching windows leaves the popover open", async ({ page, open }) => {
    await open("popover")
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.evaluate(() => window.dispatchEvent(new Event("blur")))
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("not dismissible", { tag: "@enhancement" }, () => {
  const log = (page: Page) =>
    page.evaluate(() => (window as unknown as { __popoverLog?: string[] }).__popoverLog ?? [])

  test.beforeEach(async ({ open, page }) => {
    await open("popover", { dismissible: "false" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
  })

  test("Escape reports an attempt and keeps it open", async ({ page }) => {
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeVisible()
    expect(await log(page)).toEqual(["attempt:escape-key"])
  })

  test("an outside press reports an attempt and keeps it open", async ({ page }) => {
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeVisible()
    expect(await log(page)).toEqual(["attempt:outside-press"])
  })

  test("the trigger and the close button still close it", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeHidden()
    await trigger(page).click()
    await dialog(page).getByRole("button", { name: "Close" }).click()
    await expect(dialog(page)).toBeHidden()
    expect(await log(page)).toEqual([])
  })
})

test.describe("modal", () => {
  for (const modal of ["true", "trap-focus"]) {
    test(`with modal ${modal}, Tab stays inside the popover`, async ({ page, open, tab }) => {
      await open("popover", { modal })
      await openWithKeyboard(page)
      await page.getByRole("button", { name: "Close" }).focus()
      await tab()
      await expect(dialog(page)).toBeVisible()
      await expect
        .poll(() => page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')))
        .toBe(true)
    })
  }

  test("with modal true, an outside press only closes the popover", async ({ page, open }) => {
    await open("popover", { modal: "true" })
    // Modal popovers hide the rest of the page from assistive technology, so find it by text.
    const after = page.locator("button", { hasText: "After" })
    await after.evaluate((el) => el.addEventListener("click", () => (el.dataset.clicked = "")))
    const box = (await after.boundingBox())!
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await expect(dialog(page)).toBeHidden()
    await expect(after).not.toHaveAttribute("data-clicked")
  })

  test("with modal true, the page doesn't scroll while open", async ({ page, open }) => {
    await open("popover", { modal: "true", layout: "tall" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.move(5, 300)
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => scrollY)).toBe(0)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect
      .poll(async () => {
        await page.mouse.wheel(0, 400)
        return page.evaluate(() => scrollY)
      })
      .toBeGreaterThan(0)
  })
})

test.describe("hover", () => {
  test.beforeEach(async ({ open }) => {
    await open("popover", { hover: "", delay: "50", closeDelay: "50" })
  })

  test("resting the pointer on the trigger opens the popover", async ({ page }) => {
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
  })

  test("moving the pointer into the popover keeps it open", async ({ page }) => {
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
    const box = (await page.getByRole("heading", { name: "Edit profile" }).boundingBox())!
    await page.mouse.move(box.x + 10, box.y + box.height / 2, { steps: 8 })
    await page.waitForTimeout(300)
    await expect(dialog(page)).toBeVisible()
  })

  test("moving the pointer away closes the popover", async ({ page }) => {
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
    const box = (await page.getByRole("button", { name: "Before" }).boundingBox())!
    await page.mouse.move(box.x + 5, box.y + 5, { steps: 4 })
    await expect(dialog(page)).toBeHidden()
  })

  test("opening on hover leaves focus where it was", async ({ page, fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    await page.getByRole("button", { name: "Before" }).focus()
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
    await page.waitForTimeout(100)
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
  })

  test("keyboard focus on the trigger doesn't open the popover", async ({ page }) => {
    await trigger(page).focus()
    await page.waitForTimeout(200)
    await expect(dialog(page)).toBeHidden()
  })

  test("Escape on a popover opened by hover leaves focus where it was", async ({
    page,
    open,
    fixtureOptions,
  }) => {
    test.skip(isSheet(fixtureOptions), "A sheet is modal by default, so focus and presses stay in it.")
    await page.getByRole("button", { name: "Before" }).focus()
    await trigger(page).hover()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
  })

  test("pressing the trigger still opens the popover", async ({ page }) => {
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("positioning", () => {
  test.beforeEach(({ fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet isn't placed against its trigger.")
  })

  test("the popover opens below the trigger", async ({ page }) => {
    await trigger(page).click()
    const popup = (await dialog(page).boundingBox())!
    const anchor = (await trigger(page).boundingBox())!
    expect(popup.y).toBeGreaterThanOrEqual(anchor.y + anchor.height - 1)
    await expect(dialog(page)).toHaveAttribute("data-side", "bottom")
  })

  test("the popover flips above the trigger when there is no room below", async ({ page, open }) => {
    await open("popover", { layout: "bottom" })
    await trigger(page).click()
    const popup = (await dialog(page).boundingBox())!
    const anchor = (await trigger(page).boundingBox())!
    expect(popup.y + popup.height).toBeLessThanOrEqual(anchor.y + 1)
    await expect(dialog(page)).toHaveAttribute("data-side", "top")
  })

  test("a popover above its trigger stays against it as its content grows", async ({ page, open }) => {
    await open("popover", { layout: "bottom" })
    await trigger(page).click()
    await expect(dialog(page)).toHaveAttribute("data-side", "top")
    // Measured once the entrance has finished, which a loaded machine slows.
    await expect
      .poll(() =>
        dialog(page).evaluate((el) => !el.hasAttribute("data-starting-style") && !el.getAnimations().length),
      )
      .toBe(true)
    const gap = async () => {
      const popup = (await dialog(page).boundingBox())!
      const anchor = (await trigger(page).boundingBox())!
      return Math.round(anchor.y - (popup.y + popup.height))
    }
    const before = await gap()
    // Content added inside the popup, which positioning hears only through its size.
    await dialog(page).evaluate((el) =>
      el.append(Object.assign(document.createElement("p"), { textContent: "More" })),
    )
    await expect.poll(async () => (await dialog(page).boundingBox())!.height).toBeGreaterThan(0)
    await expect.poll(gap).toBe(before)
  })

  test("the popover opens on the requested side", async ({ page, open }) => {
    await open("popover", { side: "right" })
    await trigger(page).click()
    const popup = (await dialog(page).boundingBox())!
    const anchor = (await trigger(page).boundingBox())!
    expect(popup.x).toBeGreaterThanOrEqual(anchor.x + anchor.width - 1)
  })

  test("the popover follows its trigger when the page scrolls", async ({ page, open }) => {
    await open("popover", { layout: "tall" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.evaluate(() => scrollTo(0, 10))
    await expect
      .poll(async () => {
        const popup = (await dialog(page).boundingBox())!
        const anchor = (await trigger(page).boundingBox())!
        return Math.round(popup.y - (anchor.y + anchor.height))
      })
      .toBe(8)
  })

  test("the popover exposes the space it has as CSS variables", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    const variables = await dialog(page).evaluate((el) =>
      ["--available-height", "--available-width", "--anchor-width", "--transform-origin"].map((name) =>
        getComputedStyle(el).getPropertyValue(name),
      ),
    )
    for (const value of variables) expect(value).toMatch(/\dpx/)
  })

  test("the arrow points at the middle of the trigger", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    const arrow = (await page.locator('.arrow, [data-slot="popover-arrow"]').first().boundingBox())!
    const anchor = (await trigger(page).boundingBox())!
    expect(Math.abs(arrow.x + arrow.width / 2 - (anchor.x + anchor.width / 2))).toBeLessThanOrEqual(1)
  })

  test("the arrow outside the popover isn't clipped, and page styles still apply", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    const style = await dialog(page).evaluate((el) => {
      const { overflow, paddingTop, borderTopWidth } = getComputedStyle(el)
      return { overflow, paddingTop, borderTopWidth }
    })
    expect(style).toEqual({ overflow: "visible", paddingTop: "12px", borderTopWidth: "1px" })
    const arrow = page.locator('.arrow, [data-slot="popover-arrow"]').first()
    const box = (await arrow.boundingBox())!
    const tip = { x: box.x + box.width / 2, y: box.y + 1 }
    const hit = await arrow.evaluate((el, { x, y }) => el.contains(document.elementFromPoint(x, y)), tip)
    expect(hit).toBe(true)
  })
})

test.describe("nested popovers", () => {
  test.beforeEach(async ({ open, page }) => {
    await open("popover", { nested: "" })
    await trigger(page).click()
    await page.getByRole("button", { name: "More" }).click()
    await expect(page.getByRole("dialog", { name: "More options" })).toBeVisible()
  })

  test("using a nested popover keeps both open", async ({ page }) => {
    await page.getByRole("button", { name: "Archive" }).click()
    expect(await lastAction(page)).toBe("archive")
    await expect(page.getByRole("dialog", { name: "More options" })).toBeVisible()
    await expect(dialog(page)).toBeVisible()
  })

  test("Escape closes only the nested popover and returns focus to its trigger", async ({ page }) => {
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog", { name: "More options" })).toBeHidden()
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole("button", { name: "More" })).toBeFocused()
  })

  test("clicking outside closes every popover", async ({ page }) => {
    await page.mouse.click(5, 5)
    await expect(page.getByRole("dialog")).toHaveCount(0)
  })
})

test.describe("a menu inside the popover", () => {
  const actions = (page: Page) => page.getByRole("button", { name: "Actions" })
  const menu = (page: Page) => page.getByRole("menu", { name: "Actions" })

  for (const modal of ["false", "true"]) {
    test(`with modal ${modal}, using the menu keeps the popover open`, async ({ page, open }) => {
      await open("popover", { menu: "", modal })
      await trigger(page).click()
      await actions(page).click()
      await expect(menu(page)).toBeVisible()
      await expect(dialog(page)).toBeVisible()
      await page.getByRole("menuitem", { name: "Duplicate" }).click()
      await expect(menu(page)).toBeHidden()
      await expect(dialog(page)).toBeVisible()
      await expect(actions(page)).toBeFocused()
      await expect(page.locator("output")).toHaveText("duplicate")
    })
  }

  test("Escape closes only the menu", async ({ page, open }) => {
    await open("popover", { menu: "" })
    await trigger(page).click()
    await actions(page).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(menu(page)).toBeHidden()
    await expect(dialog(page)).toBeVisible()
    await expect(actions(page)).toBeFocused()
  })

  test("clicking outside closes the menu and the popover", async ({ page, open }) => {
    await open("popover", { menu: "" })
    await trigger(page).click()
    await actions(page).click()
    await expect(menu(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(menu(page)).toBeHidden()
    await expect(dialog(page)).toBeHidden()
  })
})

test.describe("animation", () => {
  test("the popup animates in from its starting style", async ({ page, open, fixtureOptions }) => {
    test.skip(isSheet(fixtureOptions), "A sheet slides in, with no starting style to fade from.")
    await open("popover", { animate: "" })
    await slowTransitions(page)
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(await opacityOf(dialog(page))).toBeLessThan(0.5)
  })

  test("the popup transitions in alongside an entrance keyframe animation", async ({
    page,
    open,
    fixtureOptions,
  }) => {
    test.skip(isSheet(fixtureOptions), "A sheet slides in, with no starting style to fade from.")
    await open("popover", { animate: "" })
    await slowTransitions(page)
    await page.addStyleTag({
      content:
        '@keyframes nudge { from { translate: 0 1px } } [data-slot="popover-content"], .popup { animation: nudge 10s }',
    })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(await opacityOf(dialog(page))).toBeLessThan(0.5)
  })

  test("the popup stays mounted while it animates out", async ({ page, open }) => {
    await open("popover", { animate: "" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await transitionedIn(page)
    await trigger(page).click()
    await expect(page.locator('[role="dialog"][data-ending-style]')).toHaveCount(1)
    await expect(page.getByRole("dialog")).toHaveCount(0)
  })

  test("exit keyframes keyed on data-closed play before the popup unmounts", async ({ page }) => {
    await page.addStyleTag({
      content:
        '@keyframes exit { to { opacity: 0 } } [data-slot="popover-content"][data-closed], .popup[data-closed] { animation: exit 3s }',
    })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    const exiting = page.locator('[role="dialog"][data-closed][data-ending-style]')
    await expect(exiting).toHaveCount(1)
    expect(
      await exiting.evaluate((el) =>
        el.getAnimations().some((animation) => (animation as CSSAnimation).animationName === "exit"),
      ),
    ).toBe(true)
  })

  test("a popover reopened while its data-closed keyframes play shows open", async ({ page }) => {
    await page.addStyleTag({
      content:
        '@keyframes exit { to { opacity: 0 } } [data-slot="popover-content"][data-closed], .popup[data-closed] { animation: exit 3s }',
    })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.locator('[role="dialog"][data-ending-style]')).toHaveCount(1)
    await trigger(page).click()
    await expect(dialog(page)).toHaveAttribute("data-open", "")
    await expect(dialog(page)).not.toHaveAttribute("data-closed")
    await expect(dialog(page)).not.toHaveAttribute("data-ending-style")
  })

  test("a popover closed without animation reports closed", async ({ page, open }) => {
    await open("popover")
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.locator('[data-slot="popover-content"][data-open]')).toHaveCount(0)
  })

  test(
    "a press on a popover animating out doesn't reach what's beneath it",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("popover", { animate: "" })
      await page.addStyleTag({
        content: '[data-slot="popover-content"], .popup { transition-duration: 3s !important }',
      })
      await trigger(page).click()
      await expect(dialog(page)).toBeVisible()
      await transitionedIn(page)
      // A button underneath the popup.
      const point = await dialog(page).evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const below = document.createElement("button")
        below.textContent = "Beneath"
        below.style.cssText = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; width: ${rect.width}px; height: ${rect.height}px`
        below.addEventListener("click", () => (below.dataset.clicked = ""))
        document.body.append(below)
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      })
      await page.keyboard.press("Escape")
      await expect(
        page.locator('[data-slot="popover-content"][data-ending-style], .popup[data-ending-style]'),
      ).toHaveCount(1)
      await page.mouse.click(point.x, point.y)
      await expect(page.locator("button", { hasText: "Beneath" })).not.toHaveAttribute("data-clicked")
    },
  )

  test("rapid toggling ends in a consistent state", async ({ page, open }) => {
    await open("popover", { animate: "" })
    for (let i = 0; i < 9; i++) await trigger(page).click({ delay: 0 })
    await expect(trigger(page)).toHaveAttribute("aria-expanded", "true")
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole("dialog")).toHaveCount(1)
  })
})

test.describe("top layer", () => {
  test("popovers render into their container", async ({ page, open, fixtureOptions }) => {
    test.skip(!fixtureOptions.container, "Only for portal projects.")
    await open("popover", { nested: "" })
    await trigger(page).click()
    await expect(page.locator(`#${fixtureOptions.container} > [role="dialog"]`)).toHaveCount(1)
  })

  test("without top layer support, popovers portal to the body", async ({ page, open }) => {
    // An older browser: no popover methods, and no built-in styles that hide [popover].
    await page.addInitScript(() => {
      delete (HTMLElement.prototype as Partial<HTMLElement>).showPopover
      delete (HTMLElement.prototype as Partial<HTMLElement>).hidePopover
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style")
        style.textContent = "[popover]:not([hidden]) { display: block; }"
        document.head.append(style)
      })
    })
    await open("popover")
    await trigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(field(page)).toBeFocused()
    // A sheet's content sits in its viewport, which goes there instead.
    const parent = await dialog(page).evaluate(
      (el) =>
        (el.parentElement?.matches('[data-slot$="-viewport"]')
          ? el.parentElement.parentElement
          : el.parentElement
        )?.tagName,
    )
    expect(parent).toMatch(/BODY|DIV/)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })
})
