import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { toastFixture, type FixtureToast, toastRole } from "../fixtures/toast"

const role = () => toastRole

const { basic, success, error, promise, dialog } = toastFixture

const region = (page: Page) => page.getByRole("region", { name: toastFixture.region })
// Toasts are list items, named by their titles.
const toastNamed = (page: Page, name: string) => page.getByRole(role(), { name })
const show = (page: Page, options: FixtureToast) =>
  page.evaluate(
    (options) => (window as unknown as { showToast: (o: FixtureToast) => string }).showToast(options),
    options,
  )

const forever = Infinity as unknown as number

// A mouse drag from a toast's padding, not its text.
async function dragFromEdge(page: Page, name: string, dx: number, dy: number) {
  const box = (await toastNamed(page, name).boundingBox())!
  const x = box.x + 4
  const y = box.y + 4
  await page.mouse.move(x, y)
  await page.mouse.down()
  for (let step = 1; step <= 8; step++) await page.mouse.move(x + (dx * step) / 8, y + (dy * step) / 8)
  await page.mouse.up()
}

test.describe("showing", () => {
  test("a toast shows its title, description and action in the Notifications region", async ({
    page,
    open,
  }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    const toast = toastNamed(page, basic.title)
    await expect(toast).toBeVisible()
    await expect(region(page).getByRole(role())).toHaveCount(1)
    await expect(toast).toHaveAccessibleDescription(basic.description)
    await expect(toast.getByRole("button", { name: basic.action })).toBeVisible()
  })

  test("newer toasts come first", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await page.getByRole("button", { name: success.trigger }).click()
    const items = region(page).getByRole(role())
    await expect(items).toHaveCount(2)
    await expect(items.nth(0)).toHaveAccessibleName(success.title)
    await expect(items.nth(0)).toHaveCSS("--toast-index", "0")
    await expect(items.nth(1)).toHaveCSS("--toast-index", "1")
  })

  test("the newest toast is marked as the front one", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(toastNamed(page, success.title)).toHaveAttribute("data-front", "")
    await expect(toastNamed(page, basic.title)).not.toHaveAttribute("data-front")
  })

  test("each toast says what it's about through data-type", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: error.trigger }).click()
    await expect(toastNamed(page, error.title)).toHaveAttribute("data-type", "error")
  })

  test("the region sits on its side and alignment", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast", { side: "top", align: "start" })
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(region(page)).toHaveAttribute("data-side", "top")
    await expect(region(page)).toHaveAttribute("data-align", "start")
    const box = (await toastNamed(page, success.title).boundingBox())!
    expect(box.y).toBeLessThan(100)
    expect(box.x).toBeLessThan(100)
  })

  test("it shows above everything, in the top layer", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(toastNamed(page, success.title)).toBeVisible()
    expect(
      await page.locator('[data-slot="toast-region"]').evaluate((el) => el.matches(":popover-open")),
    ).toBe(true)
  })

  test("a promise toast loads, then shows the result", async ({ page, open }) => {
    await open("toast", { "promise-delay": "300" })
    await page.getByRole("button", { name: promise.trigger }).click()
    await expect(toastNamed(page, promise.loading)).toHaveAttribute("data-type", "loading")
    await expect(toastNamed(page, promise.success)).toHaveAttribute("data-type", "success")
  })

  test("a toast with an id that's showing is updated in place", async ({ page, open }) => {
    await open("toast")
    await show(page, { id: "upload", title: "Uploading" })
    await show(page, { id: "upload", title: "Uploaded" })
    await expect(toastNamed(page, "Uploaded")).toBeVisible()
    await expect(region(page).getByRole(role())).toHaveCount(1)
  })
})

test.describe("closing", () => {
  test("a toast closes after its duration", async ({ page, open }) => {
    await open("toast", { duration: "400" })
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(toastNamed(page, success.title)).toBeVisible()
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })

  test("Infinity keeps it until it's dismissed", async ({ page, open }) => {
    await open("toast", { duration: "300" })
    await show(page, { title: "Stays", duration: Infinity as unknown as number })
    await page.waitForTimeout(800)
    await expect(toastNamed(page, "Stays")).toBeVisible()
  })

  test("the Dismiss button closes it", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await toastNamed(page, basic.title).getByRole("button", { name: toastFixture.dismiss }).click()
    await expect(toastNamed(page, basic.title)).toHaveCount(0)
  })

  test("the action runs and closes it", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: basic.trigger }).click()
    await toastNamed(page, basic.title).getByRole("button", { name: basic.action }).click()
    await expect(toastNamed(page, basic.title)).toHaveCount(0)
    expect(await lastAction(page)).toBe(`action:${basic.action}`)
  })

  test("Escape on a focused toast closes it", async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await toastNamed(page, success.title).focus()
    await page.keyboard.press("Escape")
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })

  test("a closing toast stays while it animates out", async ({ page, open }) => {
    await open("toast", { animate: "infinite" })
    await page.getByRole("button", { name: success.trigger }).click()
    const toast = toastNamed(page, success.title)
    await expect(toast).toHaveCSS("opacity", "1")
    await page.evaluate(() => (window as unknown as { toaster: { dismiss: () => void } }).toaster.dismiss())
    // The exit lasts 100 seconds here, so it's still on the page, animating.
    await expect(page.locator(".toast[data-ending-style]")).toHaveCount(1)
  })

  test("a toast that can't be dismissed ignores Escape", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Required", dismissible: false })
    await toastNamed(page, "Required").focus()
    await page.keyboard.press("Escape")
    await expect(toastNamed(page, "Required")).toBeVisible()
  })
})

test.describe("timers", () => {
  test("hovering the region pauses its timers, and leaving resumes them", async ({
    page,
    open,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "Playwright's WebKit reports no pointerenter for a top-layer element under a still mouse.",
    )
    await open("toast", { duration: "600" })
    await page.getByRole("button", { name: success.trigger }).click()
    await toastNamed(page, success.title).hover()
    await page.waitForTimeout(1000)
    await expect(toastNamed(page, success.title)).toBeVisible()
    await page.mouse.move(0, 0)
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })

  test("focus in the region pauses its timers", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast", { duration: "600" })
    await page.getByRole("button", { name: success.trigger }).click()
    await toastNamed(page, success.title).focus()
    await page.waitForTimeout(1000)
    await expect(toastNamed(page, success.title)).toBeVisible()
    await page.getByRole("button", { name: "After" }).focus()
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })
})

test.describe("keyboard", () => {
  test(
    "F6 moves focus to the newest toast, and again back where it was",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.getByRole("button", { name: basic.trigger }).click()
      await page.getByRole("button", { name: success.trigger }).click()
      await page.getByRole("button", { name: "Before" }).focus()
      await page.keyboard.press("F6")
      await expect(toastNamed(page, success.title)).toBeFocused()
      await page.keyboard.press("F6")
      await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    },
  )

  test("the shortcut is configurable", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast", { shortcut: "alt+t" })
    await page.getByRole("button", { name: success.trigger }).click()
    await page.getByRole("button", { name: "Before" }).focus()
    await page.keyboard.press("Alt+KeyT")
    await expect(toastNamed(page, success.title)).toBeFocused()
  })

  test("the region names its shortcut", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(region(page)).toHaveAttribute("aria-keyshortcuts", "F6")
  })

  // Reached with F6.
  test(
    "when the focused toast closes, focus goes to the next one, then back where it was",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.getByRole("button", { name: basic.trigger }).click()
      await page.getByRole("button", { name: success.trigger }).click()
      await page.getByRole("button", { name: "Before" }).focus()
      await page.keyboard.press("F6")
      await expect(toastNamed(page, success.title)).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(toastNamed(page, basic.title)).toBeFocused()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("button", { name: "Before" })).toBeFocused()
    },
  )
})

test.describe("stacking", () => {
  test(
    "only maxVisible toasts show; the rest wait for room",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast", { "max-visible": "2" })
      for (const title of ["One", "Two", "Three"])
        await show(page, { title, duration: Infinity as unknown as number })
      await expect(region(page).getByRole(role())).toHaveCount(2)
      await expect(toastNamed(page, "One")).toHaveCount(0)
      await toastNamed(page, "Three").getByRole("button", { name: toastFixture.dismiss }).click()
      await expect(toastNamed(page, "One")).toBeVisible()
    },
  )

  test("the stack expands while hovered or focused", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast")
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(region(page)).not.toHaveAttribute("data-expanded")
    await toastNamed(page, success.title).focus()
    await expect(region(page)).toHaveAttribute("data-expanded", "")
    await expect(toastNamed(page, success.title)).toHaveAttribute("data-expanded", "")
  })

  test("expanded keeps the stack expanded", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("toast", { expanded: "" })
    await page.getByRole("button", { name: success.trigger }).click()
    await expect(region(page)).toHaveAttribute("data-expanded", "")
  })

  test(
    "toasts measure their heights and offsets for the stack",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.getByRole("button", { name: basic.trigger }).click()
      await page.getByRole("button", { name: success.trigger }).click()
      const front = (await toastNamed(page, success.title).boundingBox())!.height
      const pixels = async (locator: ReturnType<Page["locator"]>, name: string) =>
        parseFloat(await locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), name))
      await expect.poll(() => pixels(toastNamed(page, basic.title), "--toast-offset")).toBeCloseTo(front, 1)
      await expect
        .poll(() => pixels(page.locator('[data-slot="toast-region"]'), "--toast-front-height"))
        .toBeCloseTo(front, 1)
    },
  )

  test(
    "a toast measures its content's height, whatever height it's given",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      const id = await show(page, { title: "Uploading", duration: forever })
      const toast = toastNamed(page, "Uploading")
      const before = (await toast.boundingBox())!.height
      await page.addStyleTag({ content: ".toast { height: 10px }" })
      await page.evaluate(
        (id) =>
          (
            window as unknown as { toaster: { update: (id: string, o: { description: string }) => void } }
          ).toaster.update(id, { description: "Two files left, about a minute remaining" }),
        id,
      )
      const height = () =>
        toast.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--toast-height")))
      await expect.poll(height).toBeGreaterThan(before)
      expect((await toast.boundingBox())!.height).toBeLessThan(before)
    },
  )

  test(
    "a toast given its measured height animates to a new one when its content changes",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.addStyleTag({
        content: ".toast { height: var(--toast-height); transition: height 2s linear }",
      })
      const id = await show(page, { title: "Uploading", duration: forever })
      const toast = toastNamed(page, "Uploading")
      await expect
        .poll(() => toast.evaluate((el) => el.style.getPropertyValue("--toast-height")))
        .not.toBe("")
      await page.evaluate(
        (id) =>
          (
            window as unknown as { toaster: { update: (id: string, o: { description: string }) => void } }
          ).toaster.update(id, { description: "Two files left, about a minute remaining" }),
        id,
      )
      await expect
        .poll(() =>
          toast.evaluate((el) =>
            el
              .getAnimations()
              .some((animation) => (animation as CSSTransition).transitionProperty === "height"),
          ),
        )
        .toBe(true)
    },
  )

  test(
    "a toast measures again when a child, its class or its padding changes",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.addStyleTag({
        content:
          ".toast { height: var(--toast-height) } .toast.roomy { padding-block: 60px } .toast[data-roomier] { padding-block: 90px }",
      })
      await show(page, { title: "Uploading", duration: forever })
      const toast = toastNamed(page, "Uploading")
      const height = () =>
        toast.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--toast-height")))
      await expect.poll(height).toBeGreaterThan(0)
      const before = await height()
      await toast.evaluate(
        (el) => ((el.querySelector(".toast-title") as HTMLElement).style.paddingBottom = "40px"),
      )
      await expect.poll(height).toBeCloseTo(before + 40, 0)
      await toast.evaluate((el) => el.classList.add("roomy"))
      await expect.poll(height).toBeGreaterThan(before + 40)
      const roomy = await height()
      await toast.evaluate((el) => el.setAttribute("data-roomier", ""))
      await expect.poll(height).toBeCloseTo(roomy + 60, 0)
    },
  )

  test(
    "a toast closing from the front stays in front while it animates out",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast", { animate: "infinite" })
      await show(page, { title: "Older", duration: forever })
      const id = await show(page, { title: "Newer", duration: forever })
      await expect(toastNamed(page, "Newer")).toHaveCSS("opacity", "1")
      await page.evaluate(
        (id) => (window as unknown as { toaster: { dismiss: (id: string) => void } }).toaster.dismiss(id),
        id,
      )
      await expect(page.locator(".toast[data-ending-style]")).toHaveAttribute("data-front", "")
      await expect(toastNamed(page, "Older")).toHaveAttribute("data-front", "")
    },
  )
})

test.describe("swiping", () => {
  // `pause` slows the drag down, so it isn't a flick.
  async function drag(page: Page, name: string, dx: number, dy: number, pause = 0) {
    const box = (await toastNamed(page, name).boundingBox())!
    // From the toast's padding, not its text.
    const x = box.x + 4
    const y = box.y + 4
    await page.mouse.move(x, y)
    await page.mouse.down()
    for (let step = 1; step <= 8; step++) {
      await page.mouse.move(x + (dx * step) / 8, y + (dy * step) / 8)
      if (pause) await page.waitForTimeout(pause)
    }
    await page.mouse.up()
  }

  test("swiping toward the region's side dismisses", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Swipe me", duration: Infinity as unknown as number })
    await drag(page, "Swipe me", 0, 80)
    await expect(toastNamed(page, "Swipe me")).toHaveCount(0)
  })

  test("swiping toward the aligned edge dismisses too", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Swipe me", duration: Infinity as unknown as number })
    await drag(page, "Swipe me", 100, 0)
    await expect(toastNamed(page, "Swipe me")).toHaveCount(0)
  })

  test("a short swipe snaps back", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Swipe me", duration: Infinity as unknown as number })
    await drag(page, "Swipe me", 0, 20, 40)
    await expect(toastNamed(page, "Swipe me")).toBeVisible()
    await expect(toastNamed(page, "Swipe me")).not.toHaveAttribute("data-swiping")
  })

  test("swiping away from the side never dismisses", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Swipe me", duration: Infinity as unknown as number })
    await drag(page, "Swipe me", 0, -120)
    await drag(page, "Swipe me", -120, 0)
    await expect(toastNamed(page, "Swipe me")).toBeVisible()
  })

  test("a toast that can't be dismissed doesn't swipe", async ({ page, open }) => {
    await open("toast")
    await show(page, { title: "Required", dismissible: false, duration: Infinity as unknown as number })
    await drag(page, "Required", 0, 100)
    await expect(toastNamed(page, "Required")).toBeVisible()
  })
})

test.describe("over a modal dialog", () => {
  test(
    "a toast shown from a modal dialog is visible, usable and above it",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("toast")
      await page.getByRole("button", { name: dialog.trigger }).click()
      const modal = page.getByRole("dialog", { name: dialog.title })
      await expect(modal).toBeVisible()
      await page.getByRole("button", { name: dialog.toast }).click()
      const undo = toastNamed(page, basic.title).getByRole("button", { name: basic.action })
      await undo.click()
      expect(await lastAction(page)).toBe(`action:${basic.action}`)
      await expect(modal).toBeVisible()
    },
  )
})

test.describe("updates after closing", () => {
  test("a promise toast dismissed while loading stays closed", async ({ page, open }) => {
    await open("toast", { "promise-delay": "300" })
    await page.getByRole("button", { name: toastFixture.promise.trigger }).click()
    await expect(toastNamed(page, toastFixture.promise.loading)).toBeVisible()
    await page.evaluate(() => (window as any).toaster.dismiss())
    await page.waitForTimeout(600)
    await expect(region(page).getByRole(role())).toHaveCount(0)
  })

  test("an update after a toast closed never brings it back", async ({ page, open }) => {
    await open("toast")
    await page.evaluate(() => {
      const toaster = (window as any).toaster
      const id = toaster("Gone")
      toaster.dismiss(id)
      toaster.update(id, "Back")
    })
    await page.waitForTimeout(200)
    await expect(page.getByRole(role(), { name: "Back" })).toHaveCount(0)
  })
})

test.describe("more pausing and keys", () => {
  test("the window losing focus pauses timers, and getting it back resumes them", async ({
    page,
    open,
    browserName,
  }) => {
    test.skip(browserName === "firefox", "Automated Firefox never fires window blur.")
    await open("toast", { duration: "500" })
    await page.getByRole("button", { name: success.trigger }).click()
    await page.evaluate(() => window.dispatchEvent(new FocusEvent("blur")))
    await page.waitForTimeout(900)
    await expect(toastNamed(page, success.title)).toBeVisible()
    await page.evaluate(() => window.dispatchEvent(new FocusEvent("focus")))
    await expect(toastNamed(page, success.title)).toHaveCount(0)
  })
  test("F6 does nothing while there are no toasts, so the browser keeps it", async ({ page, open }) => {
    await open("toast")
    const prevented = await page.evaluate(() => {
      let prevented = false
      window.addEventListener("keydown", (event) => (prevented = event.defaultPrevented))
      document.body.dispatchEvent(
        new KeyboardEvent("keydown", { key: "F6", bubbles: true, cancelable: true }),
      )
      return prevented
    })
    expect(prevented).toBe(false)
  })
  test("a toast on the top edge swipes up, and a swipe down snaps back", async ({ page, open }) => {
    await open("toast", { side: "top", align: "center" })
    await show(page, { title: "Swipe me", duration: forever })
    await dragFromEdge(page, "Swipe me", 0, 80)
    await expect(toastNamed(page, "Swipe me")).toBeVisible()
    await dragFromEdge(page, "Swipe me", 0, -80)
    await expect(toastNamed(page, "Swipe me")).toHaveCount(0)
  })
})
