import { buttonNamed, expect, lastAction, test } from "../fixtures"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const submissions = (page: import("@playwright/test").Page) =>
  page.getByRole("status", { name: "Submissions" })

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test.beforeEach(async ({ open }) => {
    await open("toggle")
  })

  test.describe("toggle group", () => {
    test("Tab lands on the pressed toggle the first time", async ({
      page,
      open,
      tab,
    }) => {
      await open("toggle", { alignment: "right" })
      await buttonNamed(page, "Bookmark").focus()
      await tab()
      await expect(buttonNamed(page, "Right")).toBeFocused()
    })

    test("disabled toggles stay reachable with arrow keys, and say they're disabled", async ({
      page,
    }) => {
      await buttonNamed(page, "Bold").focus()
      await page.keyboard.press("End")
      const strikethrough = buttonNamed(page, "Strikethrough")
      await expect(strikethrough).toBeFocused()
      await expect(strikethrough).toHaveAttribute("aria-disabled", "true")
      await page.keyboard.press(" ")
      await expect(strikethrough).toHaveAttribute("aria-pressed", "false")
    })

    test("a disabled group keeps its tab stop, so it stays discoverable", async ({
      page,
      open,
      tab,
    }) => {
      await open("toggle", { disabled: "" })
      await buttonNamed(page, "Right").focus()
      await tab()
      await expect(buttonNamed(page, "Bold")).toBeFocused()
      await expect(buttonNamed(page, "Bold")).toHaveAttribute(
        "aria-disabled",
        "true"
      )
    })

    test("with deselectable off, the pressed toggle stays pressed", async ({
      page,
      open,
    }) => {
      await open("toggle", { deselectable: "false" })
      await buttonNamed(page, "Left").click()
      await expect(buttonNamed(page, "Left")).toHaveAttribute(
        "aria-pressed",
        "true"
      )
      await buttonNamed(page, "Center").click()
      await expect(buttonNamed(page, "Center")).toHaveAttribute(
        "aria-pressed",
        "true"
      )
      await expect(buttonNamed(page, "Left")).toHaveAttribute(
        "aria-pressed",
        "false"
      )
    })

    test("pressed values are reported in the order the toggles appear", async ({
      page,
    }) => {
      await buttonNamed(page, "Underline").click()
      await buttonNamed(page, "Italic").click()
      expect(await lastAction(page)).toBe("formatting: bold, italic, underline")
    })

    test("a controller sets the pressed toggles from anywhere", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Clear formatting" }).click()
      await expect(buttonNamed(page, "Bold")).toHaveAttribute(
        "aria-pressed",
        "false"
      )
      expect(await lastAction(page)).toBe("formatting: none")
    })
  })

  test.describe("button", () => {
    test("a Promise from the handler makes the button pending until it settles", async ({
      page,
    }) => {
      const publish = buttonNamed(page, "Publish")
      await publish.focus()
      await page.keyboard.press("Enter")
      await expect(publish).toHaveAttribute("aria-busy", "true")
      await expect(publish).toHaveAttribute("data-pending", "")
      // It isn't disabled, so focus stays on it.
      await expect(publish).toBeFocused()
      await page.getByRole("button", { name: "Finish publishing" }).click()
      await expect(publish).not.toHaveAttribute("aria-busy", /.*/)
      expect(await lastAction(page)).toBe("published")
    })

    test("a pending button ignores presses", async ({ page }) => {
      const publish = buttonNamed(page, "Publish")
      await publish.click()
      await expect(publish).toHaveAttribute("aria-busy", "true")
      await page.getByRole("button", { name: "Finish publishing" }).click()
      await expect(publish).not.toHaveAttribute("aria-busy", /.*/)
      await publish.click()
      await expect(publish).toHaveAttribute("aria-busy", "true")
      await publish.focus()
      await page.keyboard.press("Enter")
      await page.getByRole("button", { name: "Finish publishing" }).click()
      await expect(publish).not.toHaveAttribute("aria-busy", /.*/)
      expect(await lastAction(page)).toBe("published")
    })

    test("a pending submit button blocks a second submit, also from Enter in a field", async ({
      page,
    }) => {
      const submit = buttonNamed(page, "Submit")
      await submit.click()
      await expect(submissions(page)).toHaveText("1")
      await expect(submit).toHaveAttribute("aria-busy", "true")
      await expect(submit).toHaveAttribute("aria-disabled", "true")
      // Forced, since Playwright won't click an aria-disabled button, and a user still can.
      await submit.click({ force: true })
      await page.getByRole("textbox", { name: "Name" }).press("Enter")
      await expect(submissions(page)).toHaveText("1")
      await page.getByRole("button", { name: "Finish saving" }).click()
      await expect(submit).not.toHaveAttribute("aria-busy", /.*/)
      await submit.click()
      await expect(submissions(page)).toHaveText("2")
    })

    test("a rejected Promise ends the pending state", async ({ page }) => {
      const publish = buttonNamed(page, "Publish")
      await publish.click()
      await page.getByRole("button", { name: "Fail publishing" }).click()
      await expect(publish).not.toHaveAttribute("aria-busy", /.*/)
      expect(await lastAction(page)).toBe("publishing")
    })

    test("the handler hears whether a mouse or the keyboard pressed the button", async ({
      page,
    }) => {
      const pressedWith = page.getByRole("status", { name: "Pressed with" })
      const save = buttonNamed(page, "Save")
      await save.click()
      await expect(pressedWith).toHaveText("mouse")
      await save.press("Enter")
      await expect(pressedWith).toHaveText("keyboard")
    })

    test("a button rendered as a link stays a link, and follows it", async ({
      page,
    }) => {
      const docs = page.getByRole("link", { name: "Docs" })
      await expect(docs).not.toHaveAttribute("type", /.*/)
      await docs.click()
      await expect(page).toHaveURL(/#docs$/)
    })
  })

  test("a decorative separator is hidden from assistive technology", async ({
    page,
  }) => {
    await expect(page.getByRole("separator")).toHaveCount(2)
    await expect(
      page.locator('[data-slot="separator"][role="none"]')
    ).toHaveCount(1)
  })
})
