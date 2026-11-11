import type { Page } from "@playwright/test"
import {
  dialogNamesAtFocus,
  entered,
  expect,
  isSheet,
  lastAction,
  opacityOf,
  recordDialogNamesAtFocus,
  slowTransitions,
  test,
} from "../fixtures"

// A modal dialog and an alert dialog, following the WAI-ARIA patterns:
// https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ and
// https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Profile settings" })
const trigger = (page: Page) =>
  page.getByRole("button", { name: "Edit profile" })
const field = (page: Page) =>
  page.getByRole("textbox", { name: "Display name" })
const alert = (page: Page) =>
  page.getByRole("alertdialog", { name: "Delete project?" })
const alertTrigger = (page: Page) =>
  page.getByRole("button", { name: "Delete project" })
// While a modal dialog is open, the rest of the page is hidden from
// assistive technology, so outside elements are found by text.
const outside = (page: Page, text: string) =>
  page.locator("button", { hasText: new RegExp(`^${text}$`) })

const nestedDialog = (page: Page) =>
  page.getByRole("dialog", { name: "Advanced settings" })

// Defines a custom element whose open shadow root holds `html`.
async function defineElement(page: Page, name: string, html: string) {
  await page.evaluate(
    ([name, html]) => {
      if (customElements.get(name)) {
        return
      }
      customElements.define(
        name,
        class extends HTMLElement {
          constructor() {
            super()
            this.attachShadow({ mode: "open" }).innerHTML = html
          }
        }
      )
    },
    [name, html]
  )
}

// The text of the focused element, inside shadow roots too.
const focusedText = (page: Page) =>
  page.evaluate(() => {
    let el = document.activeElement
    while (el?.shadowRoot?.activeElement) {
      el = el.shadowRoot.activeElement
    }
    return el?.textContent?.trim()
  })

async function openWithKeyboard(page: Page) {
  await trigger(page).focus()
  await page.keyboard.press("Enter")
  await expect(field(page)).toBeFocused()
}

test.beforeEach(async ({ open }) => {
  await open("dialog")
})

test.describe("trigger", () => {
  test("advertises a dialog", async ({ page }) => {
    await expect(trigger(page)).toHaveAttribute("aria-haspopup", "dialog")
  })

  test("click opens the dialog", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
  })

  for (const key of ["Enter", " "]) {
    test(`${key === " " ? "Space" : key} opens the dialog`, async ({
      page,
    }) => {
      await trigger(page).focus()
      await page.keyboard.press(key)
      await expect(dialog(page)).toBeVisible()
    })
  }
})

test.describe("focus", () => {
  test("opening moves focus to the first focusable element", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(field(page)).toBeFocused()
  })

  test("each time focus moves in, the dialog is named by its title and described by its description", async ({
    page,
  }) => {
    await recordDialogNamesAtFocus(page)
    for (const time of [1, 2]) {
      await openWithKeyboard(page)
      await page.keyboard.press("Escape")
      await expect(trigger(page)).toBeFocused()
      expect(await dialogNamesAtFocus(page), `open ${time}`).toEqual(
        Array(time).fill("Profile settings / Make changes to your profile.")
      )
    }
  })

  test("Tab moves through the dialog in order", async ({ page, tab }) => {
    await openWithKeyboard(page)
    await tab()
    await expect(page.getByRole("button", { name: "Save" })).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused()
  })

  test("Tab from the last element wraps to the first", async ({
    page,
    tab,
  }) => {
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(field(page)).toBeFocused()
  })

  test("Shift+Tab from the first element wraps to the last", async ({
    page,
    tab,
  }) => {
    await openWithKeyboard(page)
    await tab({ shift: true })
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused()
  })

  test("Shift+Tab from the first element wraps to the checked radio of a group outside a form", async ({
    page,
    tab,
  }) => {
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<label><input type="radio" name="speed" checked> Standard</label><label><input type="radio" name="speed"> Express</label>`
      )
    )
    await tab({ shift: true })
    await expect(page.getByRole("radio", { name: "Standard" })).toBeFocused()
  })

  test("Tab reaches radios whose group's checked radio is behind the dialog", async ({
    page,
    tab,
  }) => {
    await outside(page, "After").evaluate((el) =>
      el.insertAdjacentHTML(
        "afterend",
        `<input type="radio" name="speed" aria-label="Page speed" checked>`
      )
    )
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<label><input type="radio" name="speed"> Standard</label><label><input type="radio" name="speed"> Express</label>`
      )
    )
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(page.getByRole("radio", { name: "Standard" })).toBeFocused()
  })

  test("Tab visits a positive tabindex first, like the browser", async ({
    page,
    tab,
  }) => {
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<button type="button" tabindex="1">Jump ahead</button>`
      )
    )
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "Jump ahead" })).toBeFocused()
    await tab()
    await expect(field(page)).toBeFocused()
  })

  test("a positive tabindex keeps Tab inside a dialog that leaves the page usable", async ({
    page,
    open,
    tab,
  }) => {
    await open("dialog", { modal: "trap-focus" })
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<button type="button" tabindex="1">Jump ahead</button>`
      )
    )
    await page.getByRole("button", { name: "Jump ahead" }).focus()
    await tab()
    await expect(field(page)).toBeFocused()
    await tab({ shift: true })
    await expect(page.getByRole("button", { name: "Jump ahead" })).toBeFocused()
  })

  test("a positive tabindex slotted into a custom element keeps its host's place", async ({
    page,
    tab,
  }) => {
    await defineElement(page, "x-card", "<slot></slot>")
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<x-card><button type="button" tabindex="1">Slotted</button></x-card>`
      )
    )
    await page.getByRole("button", { name: "Close" }).focus()
    await tab()
    await expect(page.getByRole("button", { name: "Slotted" })).toBeFocused()
    await tab()
    await expect(field(page)).toBeFocused()
  })

  test("with a positive tabindex in the dialog, Tab still moves through a shadow root and slots", async ({
    page,
    tab,
  }) => {
    await defineElement(
      page,
      "x-pair",
      `<button type="button">Inner A</button><button type="button">Inner B</button>`
    )
    await defineElement(
      page,
      "x-swap",
      `<slot name="a"></slot><slot name="b"></slot>`
    )
    await openWithKeyboard(page)
    await field(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "afterend",
        `<x-pair></x-pair><x-swap><button type="button" slot="b">Slot B</button><button type="button" slot="a">Slot A</button></x-swap>`
      )
    )
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<button type="button" tabindex="1">Jump ahead</button>`
      )
    )
    const visited = []
    for (let step = 0; step < 4; step++) {
      await tab()
      visited.push(await focusedText(page))
    }
    expect(visited).toEqual(["Inner A", "Inner B", "Slot A", "Slot B"])
  })

  test("with a positive tabindex in the dialog, Tab from a focused element outside the tab order goes to the next stop", async ({
    page,
    tab,
  }) => {
    await openWithKeyboard(page)
    await field(page).evaluate((el) =>
      el.insertAdjacentHTML("afterend", `<p tabindex="-1">Note</p>`)
    )
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<button type="button" tabindex="1">Jump ahead</button>`
      )
    )
    await page.getByText("Note").focus()
    await tab()
    await expect(page.getByRole("button", { name: "Save" })).toBeFocused()
  })

  test("Tab from a custom element with a positive tabindex enters its shadow root", async ({
    page,
    tab,
  }) => {
    await defineElement(
      page,
      "x-panel",
      `<button type="button">Inside</button>`
    )
    await openWithKeyboard(page)
    await dialog(page).evaluate((el) =>
      el.insertAdjacentHTML(
        "beforeend",
        `<x-panel tabindex="1" aria-label="Panel"></x-panel>`
      )
    )
    await page.locator("x-panel").focus()
    await tab()
    expect(await focusedText(page)).toBe("Inside")
    await tab()
    await expect(field(page)).toBeFocused()
  })

  test("opening focuses the first field even when a later one has a positive tabindex", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const raise = () =>
        document
          .querySelectorAll("button")
          .forEach((el) => el.textContent === "Save" && (el.tabIndex = 1))
      raise()
      new MutationObserver(raise).observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
    await openWithKeyboard(page)
  })

  test("Escape closes the dialog and returns focus to the trigger", async ({
    page,
  }) => {
    await openWithKeyboard(page)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("Escape after a click returns focus to the trigger", async ({
    page,
  }) => {
    await trigger(page).click()
    await expect(field(page)).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("the close button closes the dialog and returns focus to the trigger", async ({
    page,
  }) => {
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Close" }).focus()
    await page.keyboard.press("Enter")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("a virtual click from a screen reader moves focus into the dialog", async ({
    page,
  }) => {
    await trigger(page).evaluate((el) => (el as HTMLElement).click())
    await expect(field(page)).toBeFocused()
  })

  test("a touch press focuses the dialog itself, so no on-screen keyboard appears", async ({
    browser,
    framework,
    baseURL,
  }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      baseURL,
    })
    const page = await context.newPage()
    await page.goto(`/?fixture=dialog&framework=${framework}`)
    await page.locator("body[data-mounted]").waitFor({ state: "attached" })
    await trigger(page).tap()
    await expect(dialog(page)).toBeVisible()
    await expect(dialog(page)).toBeFocused()
    await context.close()
  })

  test("pressing a button inside keeps the dialog open", async ({ page }) => {
    await trigger(page).click()
    await page.getByRole("button", { name: "Save" }).click()
    // Found by element, since a modal dialog may hide the status region.
    await expect(page.locator("output")).toHaveText("save")
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("dismissal", () => {
  test("pressing the backdrop closes the dialog", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
  })

  test("pressing the backdrop returns focus to the trigger", async ({
    page,
  }) => {
    await openWithKeyboard(page)
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("clicking inside the dialog keeps it open", async ({ page }) => {
    await trigger(page).click()
    await page.getByRole("heading", { name: "Profile settings" }).click()
    await expect(dialog(page)).toBeVisible()
  })

  test("an outside press doesn't reach the page", async ({ page }) => {
    const after = outside(page, "After")
    await after.evaluate((el) =>
      el.addEventListener("click", () => (el.dataset.clicked = ""))
    )
    const box = (await after.boundingBox())!
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await expect(dialog(page)).toBeHidden()
    await expect(after).not.toHaveAttribute("data-clicked")
  })
})

test.describe("presses", () => {
  test("selecting text in a field and releasing over the backdrop keeps the dialog open", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await openWithKeyboard(page)
    const box = (await field(page).boundingBox())!
    await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2)
    await page.mouse.down()
    const point = { x: 5, y: 5 }
    await page.mouse.move(point.x, point.y, { steps: 6 })
    await page.mouse.up()
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
  })

  test("pressing the backdrop and releasing inside the dialog keeps it open", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await openWithKeyboard(page)
    const point = { x: 5, y: 5 }
    await page.mouse.move(point.x, point.y)
    await page.mouse.down()
    const box = (await page
      .getByRole("heading", { name: "Profile settings" })
      .boundingBox())!
    await page.mouse.move(box.x + 4, box.y + 4, { steps: 6 })
    await page.mouse.up()
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
  })

  test("a right click on the backdrop keeps the dialog open", async ({
    page,
    open,
  }) => {
    await open("dialog")
    await openWithKeyboard(page)
    await page.mouse.click(5, 5, { button: "right" })
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
  })

  test("a dialog styled only with ::backdrop closes when the backdrop is pressed", async ({
    page,
    open,
  }) => {
    await open("dialog", { backdrop: "none" })
    await openWithKeyboard(page)
    await page.mouse.click(5, 5)
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })

  test("with closeOnOutsidePress false, pressing the backdrop keeps the dialog open", async ({
    page,
    open,
  }) => {
    await open("dialog", { outside: "false" })
    await openWithKeyboard(page)
    await page.mouse.click(5, 5)
    await page.waitForTimeout(100)
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
  })

  test("pressing a nested dialog's backdrop closes only the nested dialog", async ({
    page,
    open,
  }) => {
    await open("dialog", { nested: "" })
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Advanced" }).click()
    await expect(nestedDialog(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(nestedDialog(page)).toBeHidden()
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole("button", { name: "Advanced" })).toBeFocused()
  })

  test("while the dialog animates out, a press on its backdrop doesn't reach the page", async ({
    page,
    open,
  }) => {
    await open("dialog", { animate: "" })
    await page.addStyleTag({
      content:
        ".dialog, .dialog-backdrop { transition-duration: 3s !important }",
    })
    const after = outside(page, "After")
    await after.evaluate((el) =>
      el.addEventListener("click", () => (el.dataset.clicked = ""))
    )
    const box = (await after.boundingBox())!
    await openWithKeyboard(page)
    // Closing during the entrance would reverse it, which CSS shortens to how far it got.
    await expect
      .poll(() =>
        dialog(page).evaluate(
          (el) =>
            !el.hasAttribute("data-starting-style") &&
            !el.getAnimations().length
        )
      )
      .toBe(true)
    await page.keyboard.press("Escape")
    await expect(page.locator(".dialog[data-ending-style]")).toHaveCount(1)
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await expect(after).not.toHaveAttribute("data-clicked")
  })

  test("Escape right after opening a nested dialog closes only the nested one", async ({
    page,
    open,
  }) => {
    await open("dialog", { nested: "" })
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Advanced" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("Escape")
    await expect(nestedDialog(page)).toBeHidden()
    await expect(dialog(page)).toBeVisible()
  })
})

test.describe("modal", () => {
  test("Tab never leaves the dialog", async ({ page, tab }) => {
    await openWithKeyboard(page)
    for (let i = 0; i < 5; i++) {
      await tab()
      await expect
        .poll(() =>
          page.evaluate(
            () => !!document.activeElement?.closest('[role="dialog"]')
          )
        )
        .toBe(true)
    }
  })

  test("the page doesn't scroll while the dialog is open", async ({
    page,
    open,
  }) => {
    await open("dialog", { layout: "tall" })
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

  test("the rest of the page is hidden from assistive technology", async ({
    page,
  }) => {
    // Hidden either way: inert, or aria-hidden.
    const hidden = () =>
      outside(page, "After").evaluate(
        (el) => !!el.closest('[inert], [aria-hidden="true"]')
      )
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(await hidden()).toBe(true)
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect.poll(hidden).toBe(false)
  })

  test("with modal false, the page stays usable", async ({ page, open }) => {
    await open("dialog", { modal: "false" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole("button", { name: "After" })).toBeVisible()
  })
})

test.describe("nested dialogs", () => {
  const nested = (page: Page) =>
    page.getByRole("dialog", { name: "Advanced settings" })

  test.beforeEach(async ({ open, page }) => {
    await open("dialog", { nested: "" })
    await openWithKeyboard(page)
    await page.getByRole("button", { name: "Advanced" }).click()
    await expect(nested(page)).toBeVisible()
  })

  test("Escape closes only the nested dialog and returns focus to its trigger", async ({
    page,
  }) => {
    await page.keyboard.press("Escape")
    await expect(nested(page)).toBeHidden()
    await expect(dialog(page)).toBeVisible()
    await expect(page.getByRole("button", { name: "Advanced" })).toBeFocused()
  })

  test("the nested dialog's close button closes only it", async ({ page }) => {
    await page.getByRole("button", { name: "Done" }).click()
    await expect(nested(page)).toBeHidden()
    await expect(dialog(page)).toBeVisible()
  })

  test("the outer dialog's open change hears only the outer dialog", async ({
    page,
  }) => {
    await page.keyboard.press("Escape")
    await expect(nested(page)).toBeHidden()
    const changes = await page.evaluate(
      () =>
        (window as unknown as { __openChanges?: string[] }).__openChanges ?? []
    )
    expect(changes.filter((change) => change.startsWith("dialog:"))).toEqual([
      "dialog:true:trigger-press",
    ])
  })

  test("Tab stays inside the nested dialog", async ({ page, tab }) => {
    await expect(page.getByRole("button", { name: "Done" })).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Done" })).toBeFocused()
  })

  test("a second Escape closes the outer dialog", async ({ page }) => {
    await page.keyboard.press("Escape")
    await expect(nested(page)).toBeHidden()
    await expect(page.getByRole("button", { name: "Advanced" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(dialog(page)).toBeHidden()
    await expect(trigger(page)).toBeFocused()
  })
})

test.describe("alert dialog", () => {
  test("opens with focus on the least destructive action", async ({ page }) => {
    await alertTrigger(page).click()
    await expect(alert(page)).toBeVisible()
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
  })

  test("is described by its message", async ({ page }) => {
    await alertTrigger(page).click()
    await expect(alert(page)).toHaveAccessibleDescription(
      "This permanently deletes the project and its files."
    )
  })

  test("an outside press keeps it open", async ({ page }) => {
    await alertTrigger(page).click()
    await expect(alert(page)).toBeVisible()
    await page.mouse.click(5, 5)
    await page.waitForTimeout(100)
    await expect(alert(page)).toBeVisible()
  })

  test("Escape closes it and returns focus to the trigger", async ({
    page,
  }) => {
    await alertTrigger(page).focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(alert(page)).toBeHidden()
    await expect(alertTrigger(page)).toBeFocused()
  })

  test("Tab cycles between its actions", async ({ page, tab }) => {
    await alertTrigger(page).click()
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
    await tab()
    await expect(
      page.getByRole("button", { name: "Delete", exact: true })
    ).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused()
  })

  test("the action reports and closes", async ({ page }) => {
    await alertTrigger(page).click()
    await page.getByRole("button", { name: "Delete", exact: true }).click()
    await expect(alert(page)).toBeHidden()
    expect(await lastAction(page)).toBe("delete")
    await expect(alertTrigger(page)).toBeFocused()
  })
})

test.describe("animation", () => {
  test("the dialog and its backdrop animate in from their starting style", async ({
    page,
    open,
    fixtureOptions,
  }) => {
    test.skip(
      isSheet(fixtureOptions),
      "A sheet slides in, with no starting style to fade from."
    )
    await open("dialog", { animate: "" })
    await slowTransitions(page)
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    expect(await opacityOf(dialog(page))).toBeLessThan(0.5)
    expect(
      await opacityOf(page.locator(".dialog-backdrop:visible"))
    ).toBeLessThan(0.5)
  })

  test("an alert dialog animates in from its starting style", async ({
    page,
    open,
  }) => {
    await open("dialog", { animate: "" })
    await slowTransitions(page)
    await alertTrigger(page).click()
    await expect(alert(page)).toBeVisible()
    expect(await opacityOf(alert(page))).toBeLessThan(0.5)
  })

  test("reopened while it animates out, it takes focus and hides the page again", async ({
    page,
    open,
  }) => {
    await open("dialog", { animate: "" })
    await openWithKeyboard(page)
    await entered(page)
    await page.keyboard.press("Escape")
    await expect(page.locator(".dialog[data-ending-style]")).toHaveCount(1)
    await page.keyboard.press("Enter")
    await expect(field(page)).toBeFocused()
    await expect
      .poll(
        () =>
          outside(page, "After").evaluate(
            (el) => !!el.closest('[inert], [aria-hidden="true"]')
          ),
        {
          message: "the page outside is hidden again",
        }
      )
      .toBe(true)
  })

  test("the dialog and its backdrop stay mounted while they animate out", async ({
    page,
    open,
  }) => {
    await open("dialog", { animate: "" })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    // Closing during the entrance would reverse it, which CSS shortens to how far it got.
    await expect
      .poll(() =>
        dialog(page).evaluate(
          (el) =>
            !el.hasAttribute("data-starting-style") &&
            !el.getAnimations().length
        )
      )
      .toBe(true)
    await page.keyboard.press("Escape")
    await expect(page.locator(".dialog[data-ending-style]")).toHaveCount(1)
    await expect(
      page.locator(".dialog-backdrop[data-ending-style]")
    ).toHaveCount(1)
    // Custom elements stay in the page, hidden.
    await expect(page.locator(".dialog:visible")).toHaveCount(0)
    await expect(page.locator(".dialog-backdrop:visible")).toHaveCount(0)
  })

  test("the dialog and its backdrop keep data-ending-style until they unmount", async ({
    page,
    open,
    framework,
  }) => {
    await open("dialog", { animate: "" })
    await trigger(page).click()
    await entered(page)
    await page.evaluate(() => {
      const exiting = [
        ...document.querySelectorAll(
          ".dialog[data-open], .dialog-backdrop[data-open]"
        ),
      ]
      const endingStyleAtRemoval = new Map<Element, boolean>()
      Object.assign(window, { exiting, endingStyleAtRemoval })
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.removedNodes) {
            for (const el of exiting) {
              if (node.contains(el)) {
                endingStyleAtRemoval.set(
                  el,
                  el.hasAttribute("data-ending-style")
                )
              }
            }
          }
        }
      }).observe(document.body, { childList: true, subtree: true })
    })
    await page.keyboard.press("Escape")
    // Custom elements stay in the page, hidden.
    const expected = framework.startsWith("web")
      ? "hidden and reset"
      : "removed while exiting"
    await expect
      .poll(() =>
        page.evaluate(() => {
          const { exiting, endingStyleAtRemoval } = window as unknown as {
            exiting: HTMLElement[]
            endingStyleAtRemoval: Map<Element, boolean>
          }
          return exiting.map((el) => {
            if (!el.isConnected) {
              return endingStyleAtRemoval.get(el)
                ? "removed while exiting"
                : "removed without data-ending-style"
            }
            return el.checkVisibility() ||
              el.hasAttribute("data-ending-style") ||
              el.inert
              ? "shown or exiting"
              : "hidden and reset"
          })
        })
      )
      .toEqual([expected, expected])
  })

  test("exit keyframes keyed on data-closed play before the dialog unmounts", async ({
    page,
  }) => {
    await page.addStyleTag({
      content:
        "@keyframes exit { to { opacity: 0 } } :is(.dialog, .dialog-backdrop)[data-closed] { animation: exit 3s }",
    })
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(
      page.locator(".dialog[data-closed][data-ending-style]")
    ).toHaveCount(1)
    await expect(
      page.locator(".dialog-backdrop[data-closed][data-ending-style]")
    ).toHaveCount(1)
    expect(
      await page
        .locator(".dialog[data-ending-style]")
        .evaluate((el) =>
          el
            .getAnimations()
            .some(
              (animation) =>
                (animation as CSSAnimation).animationName === "exit"
            )
        )
    ).toBe(true)
  })

  test("a dialog closed without animation unmounts", async ({ page }) => {
    await trigger(page).click()
    await expect(dialog(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.locator(".dialog:visible")).toHaveCount(0)
    await expect(page.locator(".dialog[data-open]")).toHaveCount(0)
  })
})

test.describe("top layer", () => {
  test("dialogs render into their container", async ({
    page,
    open,
    fixtureOptions,
  }) => {
    test.skip(!fixtureOptions.container, "Only for portal projects.")
    await open("dialog")
    await trigger(page).click()
    await expect(
      page.locator(`#${fixtureOptions.container} > [role="dialog"]`)
    ).toHaveCount(1)
  })
})
