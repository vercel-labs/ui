import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { toastFixture, type FixtureToast, toastRole } from "../fixtures/toast"

const role = () => toastRole

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.
test.describe.configure({ mode: "parallel" })

const { basic, success, error, dialog } = toastFixture
const forever = Infinity as unknown as number

const region = (page: Page) => page.getByRole("region", { name: toastFixture.region })
const toastNamed = (page: Page, name: string) => page.getByRole(role(), { name })
const show = (page: Page, options: FixtureToast) =>
  page.evaluate(
    (options) => (window as unknown as { showToast: (o: FixtureToast) => string }).showToast(options),
    options,
  )
type PageToaster = {
  toaster: ((content: string) => string) & {
    dismiss: (id?: string) => void
    update: (id: string, content: string) => boolean
  }
}

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("update() says whether the toast was still there", async ({ page, open }) => {
    await open("toast")
    const updated = await page.evaluate(() => {
      const toaster = (window as unknown as PageToaster).toaster
      const id = toaster("Gone")
      toaster.dismiss(id)
      return toaster.update(id, "Back")
    })
    expect(updated).toBe(false)
  })

  test("a toast beyond maxVisible never expires unseen", async ({ page, open }) => {
    await open("toast", { "max-visible": "1", duration: "1500" })
    await show(page, { title: "First" })
    await show(page, { title: "Second" })
    await expect(toastNamed(page, "First")).toHaveCount(0)
    // Second expires, and First, which waited with all of its time, shows for most of it.
    await page.waitForFunction(
      () => document.querySelector('[data-slot="toast-root"]')?.textContent?.includes("First"),
      undefined,
      { polling: "raf" },
    )
    await page.waitForTimeout(1000)
    await expect(toastNamed(page, "First")).toBeVisible()
  })

  test("there's no empty Notifications landmark", async ({ page, open }) => {
    await open("toast")
    await expect(region(page)).toHaveCount(0)
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(region(page)).toHaveCount(1)
    await page.evaluate(() => (window as unknown as PageToaster).toaster.dismiss())
    await expect(region(page)).toHaveCount(0)
  })

  test("focus never falls to the page when a toast focused by the mouse closes", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await page.getByRole("button", { name: success.trigger }).click()
    await toastNamed(page, success.title).getByRole("button", { name: toastFixture.dismiss }).click()
    await expect(toastNamed(page, basic.title)).toBeFocused()
  })

  test("a pending action shows it and holds the toast open until it settles", async ({ page, open }) => {
    await open("toast", { duration: "300" })
    await show(page, { title: "Archived", action: "Undo", pending: 800 })
    const undo = toastNamed(page, "Archived").getByRole("button", { name: "Undo" })
    await undo.click()
    await expect(undo).toHaveAttribute("data-pending", "")
    await expect(undo).toHaveAttribute("aria-busy", "true")
    await page.getByRole("button", { name: "After" }).focus()
    await page.waitForTimeout(500)
    await expect(toastNamed(page, "Archived")).toBeVisible()
    await expect(toastNamed(page, "Archived")).toHaveCount(0)
  })
})

test.describe("pausing", { tag: "@enhancement" }, () => {
  test("a hidden page pauses timers", async ({ page, open }) => {
    await open("toast", { duration: "500" })
    await page.getByRole("button", { name: success.trigger }).click()
    const setHidden = (hidden: boolean) =>
      page.evaluate((hidden) => {
        Object.defineProperty(document, "visibilityState", {
          value: hidden ? "hidden" : "visible",
          configurable: true,
        })
        document.dispatchEvent(new Event("visibilitychange"))
      }, hidden)
    await setHidden(true)
    await page.waitForTimeout(900)
    await expect(toastNamed(page, success.title)).toBeVisible()
    await setHidden(false)
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })

  test("pause reasons hold separately: getting the window back doesn't resume while focus is in the region", async ({
    page,
    open,
  }) => {
    await open("toast", { duration: "500" })
    await page.getByRole("button", { name: success.trigger }).click()
    await toastNamed(page, success.title).focus()
    await page.evaluate(() => window.dispatchEvent(new FocusEvent("blur")))
    await page.evaluate(() => window.dispatchEvent(new FocusEvent("focus")))
    await page.waitForTimeout(900)
    await expect(toastNamed(page, success.title)).toBeVisible()
  })
})

test.describe("announcements", { tag: "@enhancement" }, () => {
  const polite = (page: Page) => page.locator('[data-ui-sdk-announcer=""]')
  const assertive = (page: Page) => page.locator('[data-ui-sdk-announcer="assertive"]')

  test("the live regions exist before the first toast", async ({ page, open }) => {
    await open("toast")
    await expect(polite(page)).toHaveCount(1)
    await expect(assertive(page)).toHaveCount(1)
    await expect(polite(page)).toHaveText("")
  })

  test("a toast is announced politely, with its title and description", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await expect(polite(page)).toHaveText(`${basic.title}. ${basic.description}`)
  })

  test("an error is announced assertively", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: error.trigger }).click()
    await expect(assertive(page)).toHaveText(`${error.title}. ${error.description}`)
  })

  test("toasts that arrive together are announced together", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Saved" })
    await show(page, { title: "Synced" })
    await expect(polite(page)).toHaveText("Synced. Saved")
  })

  test("the visible region isn't a live region, so nothing is read twice", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await expect(region(page)).toBeVisible()
    expect(await region(page).locator("[aria-live], [role=status], [role=alert]").count()).toBe(0)
    await expect(region(page)).not.toHaveAttribute("aria-live")
  })
})

test.describe("the shortcut", { tag: "@enhancement" }, () => {
  test("F6 works from a text field and types nothing", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await page.evaluate(() => {
      const input = document.createElement("input")
      input.setAttribute("aria-label", "Search")
      document.querySelector(".fixture")!.prepend(input)
    })
    await page.getByRole("textbox", { name: "Search" }).focus()
    await page.keyboard.press("F6")
    await expect(toastNamed(page, success.title)).toBeFocused()
    await expect(page.getByRole("textbox", { name: "Search" })).toHaveValue("")
  })

  test("a shortcut of null turns it off", async ({ page, open }) => {
    await open("toast", { shortcut: "none" })
    await page.getByRole("button", { name: success.trigger }).click()
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("F6")
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    await expect(region(page)).not.toHaveAttribute("aria-keyshortcuts")
  })

  test("Tab past the last toast goes back where F6 came from", async ({ page, open, tab }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("F6")
    await expect(toastNamed(page, success.title)).toBeFocused()
    await tab()
    await expect(
      toastNamed(page, success.title).getByRole("button", { name: toastFixture.dismiss }),
    ).toBeFocused()
    await tab()
    await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
  })
})

test.describe("over modal dialogs", { tag: "@enhancement" }, () => {
  test("F6 reaches the toasts from inside a modal dialog, and goes back into it", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: dialog.trigger }).click()
    await page.getByRole("button", { name: dialog.toast }).focus()
    await page.getByRole("button", { name: dialog.toast }).press("Enter")
    await expect(toastNamed(page, basic.title)).toBeVisible()
    await page.keyboard.press("F6")
    await expect(toastNamed(page, basic.title)).toBeFocused()
    await page.keyboard.press("F6")
    await expect(page.getByRole("button", { name: dialog.toast })).toBeFocused()
  })

  test("Escape on a toast closes the toast, not the dialog beneath", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: dialog.trigger }).click()
    await page.getByRole("button", { name: dialog.toast }).click()
    await toastNamed(page, basic.title).focus()
    await page.keyboard.press("Escape")
    await expect(toastNamed(page, basic.title)).toHaveCount(0)
    await expect(page.getByRole("dialog", { name: dialog.title })).toBeVisible()
  })

  test("a dialog opened after a toast doesn't cover it, and pressing it doesn't close the dialog", async ({
    page,
    open,
  }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await expect(toastNamed(page, basic.title)).toBeVisible()
    await page.getByRole("button", { name: dialog.trigger }).click()
    await expect(page.getByRole("dialog", { name: dialog.title })).toBeVisible()
    const undo = toastNamed(page, basic.title).getByRole("button", { name: basic.action })
    const box = (await undo.boundingBox())!
    const hit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.textContent, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    })
    expect(hit).toBe(basic.action)
    await undo.click()
    expect(await lastAction(page)).toBe(`action:${basic.action}`)
    await expect(page.getByRole("dialog", { name: dialog.title })).toBeVisible()
  })
})

test.describe("swiping", { tag: "@enhancement" }, () => {
  async function drag(
    page: Page,
    name: string,
    dx: number,
    dy: number,
    from: "padding" | "text" = "padding",
  ) {
    const target = from === "text" ? toastNamed(page, name).getByText(name) : toastNamed(page, name)
    const box = (await target.boundingBox())!
    const x = from === "text" ? box.x + 2 : box.x + 4
    const y = from === "text" ? box.y + box.height / 2 : box.y + 4
    await page.mouse.move(x, y)
    await page.mouse.down()
    for (let step = 1; step <= 8; step++) await page.mouse.move(x + (dx * step) / 8, y + (dy * step) / 8)
    await page.mouse.up()
  }

  test("dragging across a toast's text with a mouse selects it instead of dismissing", async ({
    page,
    open,
  }) => {
    await open("toast")
    await show(page, { title: "Copy this order number", duration: forever })
    await drag(page, "Copy this order number", 120, 0, "text")
    await expect(toastNamed(page, "Copy this order number")).toBeVisible()
    expect(await page.evaluate(() => document.getSelection()?.toString())).not.toBe("")
  })
})
