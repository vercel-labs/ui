import { buttonNamed, expect, lastAction, test } from "../fixtures"

// The WAI-ARIA button pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

const submissions = (page: import("@playwright/test").Page) =>
  page.getByRole("status", { name: "Submissions" })

test.beforeEach(async ({ open }) => {
  await open("toggle")
})

test("clicking a button runs its handler", async ({ page }) => {
  await buttonNamed(page, "Save").click()
  expect(await lastAction(page)).toBe("save")
})

for (const key of [" ", "Enter"]) {
  test(`${key} presses a focused button`, async ({ page }) => {
    await buttonNamed(page, "Save").focus()
    await page.keyboard.press(key)
    expect(await lastAction(page)).toBe("save")
  })
}

test("a submit button submits its form", async ({ page }) => {
  await buttonNamed(page, "Submit").click()
  await expect(submissions(page)).toHaveText("1")
})

test("a reset button resets its form", async ({ page }) => {
  const name = page.getByRole("textbox", { name: "Name" })
  await name.fill("Grace")
  await buttonNamed(page, "Reset").click()
  await expect(name).toHaveValue("Ada")
  await expect(submissions(page)).toHaveText("0")
})

test("a disabled button can't be focused or pressed", async ({ page }) => {
  const remove = buttonNamed(page, "Delete")
  await expect(remove).toBeDisabled()
  await remove.click({ force: true })
  expect(await lastAction(page)).toBe("")
})

test.describe("focusable when disabled", () => {
  test("it stays focusable and says it's disabled", async ({ page }) => {
    const archive = buttonNamed(page, "Archive")
    await expect(archive).toHaveAttribute("aria-disabled", "true")
    await archive.focus()
    await expect(archive).toBeFocused()
  })

  test("Tab reaches it", async ({ page, tab }) => {
    await buttonNamed(page, "Reset").focus()
    await tab()
    await expect(buttonNamed(page, "Archive")).toBeFocused()
  })

  test("clicking it runs nothing and submits nothing", async ({ page }) => {
    await buttonNamed(page, "Archive").click({ force: true })
    expect(await lastAction(page)).toBe("")
    await expect(submissions(page)).toHaveText("0")
  })

  for (const key of [" ", "Enter"]) {
    test(`${key} on it runs nothing and submits nothing`, async ({ page }) => {
      await buttonNamed(page, "Archive").focus()
      await page.keyboard.press(key)
      expect(await lastAction(page)).toBe("")
      await expect(submissions(page)).toHaveText("0")
    })
  }
})

test.describe("pending", () => {
  test("a returned Promise makes it busy, and it keeps focus until the Promise settles", async ({
    page,
  }) => {
    const publish = buttonNamed(page, "Publish")
    await publish.focus()
    await page.keyboard.press("Enter")
    expect(await lastAction(page)).toBe("publishing")
    await expect(publish).toHaveAttribute("aria-busy", "true")
    await expect(publish).toHaveAttribute("data-pending", "")
    await expect(publish).toBeFocused()
    await buttonNamed(page, "Finish publishing").click()
    await expect(publish).not.toHaveAttribute("aria-busy")
    expect(await lastAction(page)).toBe("published")
  })

  test("while pending, it says it's unavailable with aria-disabled and keeps focus", async ({
    page,
  }) => {
    const publish = buttonNamed(page, "Publish")
    await expect(publish).not.toHaveAttribute("aria-disabled")
    await publish.focus()
    await page.keyboard.press("Enter")
    await expect(publish).toHaveAttribute("aria-disabled", "true")
    await expect(publish).not.toHaveAttribute("disabled")
    await expect(publish).toBeFocused()
    await buttonNamed(page, "Finish publishing").click()
    await expect(publish).not.toHaveAttribute("aria-disabled")
  })

  test("still pending after a second, it tells screen readers it's loading", async ({
    page,
  }) => {
    await buttonNamed(page, "Publish").click()
    await expect(page.locator('[data-ui-sdk-announcer=""]')).toHaveText(
      "Loading"
    )
  })

  test("a rejected Promise ends the pending state", async ({ page }) => {
    const publish = buttonNamed(page, "Publish")
    await publish.click()
    await buttonNamed(page, "Fail publishing").click()
    await expect(publish).not.toHaveAttribute("aria-busy")
    expect(await lastAction(page)).toBe("publishing")
  })
})

test("a button rendered as a link stays a link", async ({ page }) => {
  const docs = page.getByRole("link", { name: "Docs", exact: true })
  await expect(docs).toHaveAttribute("href", "#docs")
  await expect(docs).not.toHaveAttribute("type")
  await expect(docs).not.toHaveAttribute("role")
  await docs.focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/#docs$/)
})
