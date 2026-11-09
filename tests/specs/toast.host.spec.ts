import type { Page } from "@playwright/test"
import { expect, lastAction, test } from "../fixtures"
import { toastFixture, toastRole } from "../fixtures/toast"

const role = () => toastRole

// The overlay host: one component that renders what toast() and confirm()
// open from anywhere.
test.describe("the overlay host", { tag: "@enhancement" }, () => {
  const { basic, confirm } = toastFixture
  const region = (page: Page) =>
    page.getByRole("region", { name: toastFixture.region })
  const question = (page: Page) =>
    page.getByRole("alertdialog", { name: confirm.title })

  test("it renders toasts from their data", async ({ page, open }) => {
    await open("toast", { host: "" })
    await page.getByRole("button", { name: basic.trigger }).click()
    const toast = region(page).getByRole(role(), { name: basic.title })
    await expect(toast).toHaveAccessibleDescription(basic.description)
    await expect(toast).toHaveClass(/toast/)
    await toast.getByRole("button", { name: basic.action }).click()
    await expect(toast).toHaveCount(0)
    expect(await lastAction(page)).toBe(`action:${basic.action}`)
  })

  test("it takes the region's options", async ({ page, open }) => {
    await open("toast", { host: "", side: "top", align: "center" })
    await page.getByRole("button", { name: basic.trigger }).click()
    await expect(region(page)).toHaveAttribute("data-side", "top")
    await expect(region(page)).toHaveAttribute("data-align", "center")
  })

  test("confirm() asks with an alert dialog, starting on Cancel, and resolves true for the agreeing button", async ({
    page,
    open,
  }) => {
    await open("toast", { host: "" })
    const trigger = page.getByRole("button", { name: confirm.trigger })
    // From the keyboard, since Safari doesn't focus a button it clicks.
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(question(page)).toBeVisible()
    await expect(
      question(page).getByRole("button", { name: confirm.cancel })
    ).toBeFocused()
    await question(page).getByRole("button", { name: confirm.confirm }).click()
    await expect(question(page)).toHaveCount(0)
    expect(await lastAction(page)).toBe("confirmed")
    await expect(trigger).toBeFocused()
  })

  test("confirm() resolves false for Escape, and asks again", async ({
    page,
    open,
  }) => {
    await open("toast", { host: "" })
    await page.getByRole("button", { name: confirm.trigger }).click()
    await expect(question(page)).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(question(page)).toHaveCount(0)
    expect(await lastAction(page)).toBe("declined")
    await page.getByRole("button", { name: confirm.trigger }).click()
    await expect(question(page)).toBeVisible()
  })

  test("a toast from inside the confirm dialog stays usable above it", async ({
    page,
    open,
  }) => {
    await open("toast", { host: "" })
    await page.getByRole("button", { name: confirm.trigger }).click()
    await expect(question(page)).toBeVisible()
    await page.evaluate(() =>
      (window as unknown as { showToast: (o: object) => void }).showToast({
        title: "Heads up",
        action: "Undo",
      })
    )
    await region(page).getByRole("button", { name: "Undo" }).click()
    expect(await lastAction(page)).toBe("action:Undo")
    await expect(question(page)).toBeVisible()
  })

  test("an update that adds a cancel shows it, and it runs", async ({
    page,
    open,
  }) => {
    await open("toast", { host: "" })
    await page.evaluate(() => {
      const toaster = (window as any).toaster
      const id = toaster("Saving", { duration: Infinity })
      toaster.update(id, {
        cancel: {
          label: "Stop",
          onCancel: () =>
            (document.querySelector("output")!.textContent = "cancel:Stop"),
        },
      })
    })
    const toast = region(page).getByRole(role(), { name: "Saving" })
    await toast.getByRole("button", { name: "Stop" }).click()
    await expect(toast).toHaveCount(0)
    expect(await lastAction(page)).toBe("cancel:Stop")
  })

  test("an update that removes the cancel hides it", async ({ page, open }) => {
    await open("toast", { host: "" })
    await page.evaluate(() => {
      const toaster = (window as any).toaster
      const id = toaster("Saving", {
        duration: Infinity,
        cancel: { label: "Stop" },
      })
      ;(window as any).toastId = id
    })
    const toast = region(page).getByRole(role(), { name: "Saving" })
    await expect(toast.getByRole("button", { name: "Stop" })).toBeVisible()
    await page.evaluate(() =>
      (window as any).toaster.update((window as any).toastId, {
        cancel: undefined,
      })
    )
    await expect(toast.getByRole("button")).toHaveCount(0)
  })
})

test("a web region's renderToast fills its template from the toast's data", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    !framework.startsWith("web"),
    "Templates are the web components' way to render toasts."
  )
  await open("toast")
  await page.evaluate(() => {
    const region = document.querySelector("ui-toast-region") as HTMLElement & {
      renderToast?: unknown
    }
    region.renderToast = (
      toast: { data?: { from: string } },
      el: HTMLElement
    ) =>
      el
        .querySelector(".toast-description")!
        .setAttribute("data-from", toast.data?.from ?? "")
    const toaster = (window as any).toaster
    ;(window as any).toastId = toaster("Message", {
      duration: Infinity,
      data: { from: "Ada" },
    })
  })
  const description = page.locator(".toast-description")
  await expect(description).toHaveAttribute("data-from", "Ada")
  await page.evaluate(() =>
    (window as any).toaster.update((window as any).toastId, {
      data: { from: "Grace" },
    })
  )
  await expect(description).toHaveAttribute("data-from", "Grace")
})

test("a web region's renderToast set later fills the toasts showing, and runs again only when one changes", async ({
  page,
  open,
  framework,
}) => {
  test.skip(
    !framework.startsWith("web"),
    "Templates are the web components' way to render toasts."
  )
  await open("toast")
  await page.evaluate(() => {
    ;(window as any).toastId = (window as any).toaster("Message", {
      duration: Infinity,
    })
  })
  const toast = page
    .getByRole("region", { name: toastFixture.region })
    .getByRole(role(), { name: "Message" })
  await expect(toast).toBeVisible()
  await page.evaluate(() => {
    const region = document.querySelector("ui-toast-region") as HTMLElement & {
      renderToast?: unknown
    }
    ;(window as any).renders = 0
    region.renderToast = () => (window as any).renders++
  })
  expect(await page.evaluate(() => (window as any).renders)).toBe(1)
  // Hovering expands the region, a change of its own that isn't the toast's.
  await toast.hover()
  await expect(page.locator("ui-toast-region")).toHaveAttribute(
    "data-expanded",
    ""
  )
  expect(await page.evaluate(() => (window as any).renders)).toBe(1)
  await page.evaluate(() =>
    (window as any).toaster.update((window as any).toastId, {
      title: "Updated",
    })
  )
  await expect.poll(() => page.evaluate(() => (window as any).renders)).toBe(2)
})
