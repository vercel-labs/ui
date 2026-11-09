import { expect, test } from "../fixtures"
import { save, status, textbox } from "./form.helpers"

// Input is a native text field wired to its Field: named by the label,
// described by the description and errors, and marked invalid.

test.beforeEach(async ({ open }) => {
  await open("form")
})

test("the label names the input and the description describes it", async ({
  page,
}) => {
  await expect(textbox(page, "Username")).toHaveAccessibleDescription(
    "Letters and numbers, at least 3."
  )
  await expect(textbox(page, "Email")).toHaveValue("ada@example.com")
})

test("clicking the label focuses the input", async ({ page }) => {
  await page.getByText("Username", { exact: true }).click()
  await expect(textbox(page, "Username")).toBeFocused()
})

test("an invalid input is marked once the form tries to submit", async ({
  page,
}) => {
  await textbox(page, "Username").fill("ad")
  await expect(textbox(page, "Username")).not.toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await save(page)
  await expect(textbox(page, "Username")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await expect(textbox(page, "Username")).toHaveAttribute("data-invalid", "")
})

test("data-filled follows the text", async ({ page }) => {
  await expect(textbox(page, "Username")).not.toHaveAttribute("data-filled")
  await expect(textbox(page, "Email")).toHaveAttribute("data-filled", "")
  await textbox(page, "Username").fill("ada")
  await expect(textbox(page, "Username")).toHaveAttribute("data-filled", "")
  await textbox(page, "Username").fill("")
  await expect(textbox(page, "Username")).not.toHaveAttribute("data-filled")
})

test("an input group's clear button shows only while there's text", async ({
  page,
}) => {
  const clear = page.getByRole("button", { name: "Clear website" })
  await expect(clear).toHaveCount(0)
  await textbox(page, "Website").fill("example.com")
  await expect(clear).toBeVisible()
})

test.describe("enhancements", { tag: "@enhancement" }, () => {
  test("changes report their reason: typing, then a reset", async ({
    page,
  }) => {
    await textbox(page, "Username").fill("ada")
    await expect(status(page, "Last action")).toHaveText(
      "username:ada:input-change"
    )
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(status(page, "Last action")).toHaveText("username::reset")
    await expect(textbox(page, "Username")).toHaveValue("")
  })

  test("a canceled change keeps the text as it was", async ({ page, open }) => {
    await open("form", { "no-digits": "" })
    await textbox(page, "Username").pressSequentially("ad1a")
    await expect(textbox(page, "Username")).toHaveValue("ada")
  })

  test("a canceled change keeps a controlled input's text as it was", async ({
    page,
    open,
  }) => {
    await open("form", { controlled: "", "no-digits": "" })
    await textbox(page, "Username").pressSequentially("ad1a")
    await expect(textbox(page, "Username")).toHaveValue("ada")
  })

  test("a canceled change waits for an IME to finish before the text goes back", async ({
    page,
    open,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Composition is driven through the Chrome DevTools Protocol."
    )
    await open("form", { "no-digits": "" })
    await textbox(page, "Username").pressSequentially("ad")
    const cdp = await page.context().newCDPSession(page)
    await cdp.send("Input.imeSetComposition", {
      text: "x1",
      selectionStart: 2,
      selectionEnd: 2,
    })
    await expect(textbox(page, "Username")).toHaveValue("adx1")
    await cdp.send("Input.insertText", { text: "x1" })
    await expect(textbox(page, "Username")).toHaveValue("ad")
  })

  test("a controlled input keeps every keystroke", async ({ page, open }) => {
    await open("form", { controlled: "" })
    await textbox(page, "Username").pressSequentially("grace")
    await expect(textbox(page, "Username")).toHaveValue("grace")
    await expect(status(page, "Last action")).toHaveText(
      "username:grace:input-change"
    )
  })

  test("a required input marks its label required", async ({ page }) => {
    await expect(page.getByText("Username", { exact: true })).toHaveAttribute(
      "data-required",
      ""
    )
    await expect(page.getByText("Email", { exact: true })).not.toHaveAttribute(
      "data-required"
    )
  })
})

test.describe("input group", { tag: "@enhancement" }, () => {
  const clear = (page: import("@playwright/test").Page) =>
    page.getByRole("button", { name: "Clear website" })

  test("the clear button empties the field, reports why, and returns focus", async ({
    page,
  }) => {
    await textbox(page, "Website").fill("example.com")
    await clear(page).click()
    await expect(textbox(page, "Website")).toHaveValue("")
    await expect(textbox(page, "Website")).toBeFocused()
    await expect(status(page, "Last action")).toHaveText("website::clear-press")
    await expect(clear(page)).toHaveCount(0)
  })

  test("pressing the group's text focuses its field", async ({ page }) => {
    await page.getByText("https://").click()
    await expect(textbox(page, "Website")).toBeFocused()
  })

  test("the clear button hides while its field is disabled", async ({
    page,
  }) => {
    await textbox(page, "Website").fill("example.com")
    await page.getByRole("button", { name: "Toggle contact" }).click()
    await expect(clear(page)).toHaveCount(0)
  })
})

test("<ui-input>'s value property writes the field quietly, and its api reports", async ({
  page,
  framework,
}) => {
  test.skip(framework !== "web", "Web component markup only.")
  const input = page.locator("ui-input#website")
  await input.evaluate((el: HTMLElement & { value: string }) => {
    el.value = "example.com"
  })
  await expect(textbox(page, "Website")).toHaveValue("example.com")
  expect(
    await input.evaluate((el: HTMLElement & { value: string }) => el.value)
  ).toBe("example.com")
  await expect(status(page, "Last action")).toHaveText("")
  await input.evaluate(
    (el: HTMLElement & { api: { setValue: (value: string) => void } }) =>
      el.api.setValue("example.org")
  )
  await expect(status(page, "Last action")).toHaveText(
    "website:example.org:imperative"
  )
})
