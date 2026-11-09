import { buttonNamed, expect, test } from "../fixtures"
import {
  passwordInputAction,
  passwordInputFixture,
} from "../fixtures/password-input"

// Behavior past the WAI-ARIA pattern, tagged `@enhancement`.

const { password, form } = passwordInputFixture
const field = (page: import("@playwright/test").Page) =>
  page.getByLabel(password.label, { exact: true })
const toggle = (page: import("@playwright/test").Page) =>
  buttonNamed(page, password.toggle)

const selection = (page: import("@playwright/test").Page) =>
  field(page).evaluate((el) => {
    const input = el as HTMLInputElement
    return [input.selectionStart, input.selectionEnd]
  })

test.beforeEach(async ({ open }) => {
  await open("password-input")
})

test("showing the password keeps focus in the field, with the caret where it was @enhancement", async ({
  page,
}) => {
  await field(page).fill("correct horse")
  // Home moves to the start only on some platforms, so the caret is placed directly.
  await field(page).evaluate((el) =>
    (el as HTMLInputElement).setSelectionRange(2, 2)
  )
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  await expect(field(page)).toBeFocused()
  await expect.poll(() => selection(page)).toEqual([2, 2])
  await page.keyboard.type("X")
  await expect(field(page)).toHaveValue("coXrrect horse")
})

test("showing and hiding the password keeps the selection @enhancement", async ({
  page,
}) => {
  await field(page).fill("correct horse")
  await field(page).evaluate((el) =>
    (el as HTMLInputElement).setSelectionRange(3, 7)
  )
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  await expect.poll(() => selection(page)).toEqual([3, 7])
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(field(page)).toBeFocused()
  await expect.poll(() => selection(page)).toEqual([3, 7])
})

test("a click on the toggle while typing never blurs the field @enhancement", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await field(page).evaluate((el) => {
    Object.assign(window, { blurs: 0 })
    el.addEventListener(
      "blur",
      () => (window as unknown as { blurs: number }).blurs++
    )
  })
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  expect(
    await page.evaluate(() => (window as unknown as { blurs: number }).blurs)
  ).toBe(0)
})

test("a click on the toggle from elsewhere brings focus back to the field @enhancement", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await page.getByRole("button", { name: "After" }).focus()
  await toggle(page).click()
  await expect(field(page)).toBeFocused()
})

test("submitting hides a shown password before the page's own submit handler runs @enhancement", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("type", "text")
  await buttonNamed(page, form.submit).click()
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText(
    passwordInputAction.submit("password")
  )
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false")
})

test("submitting hides the password even when the change is canceled, while the browser reads the form @enhancement", async ({
  page,
  open,
}) => {
  await open("password-input", { "default-visible": "", cancel: "" })
  await buttonNamed(page, form.submit).click()
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText(
    passwordInputAction.submit("password")
  )
  // Canceled, so it shows again once the browser has read the form.
  await expect(field(page)).toHaveAttribute("type", "text")
})

test("resetting the form hides the password @enhancement", async ({ page }) => {
  await toggle(page).click()
  await buttonNamed(page, form.reset).click()
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText(
    passwordInputAction.visible(false, "reset")
  )
})

test("hiding the page hides the password, so the browser never keeps it as text @enhancement", async ({
  page,
}) => {
  await field(page).fill("hunter22")
  await toggle(page).click()
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pagehide", { persisted: true })
    )
  )
  await expect(field(page)).toHaveAttribute("type", "password")
  await expect(page.getByRole("status", { name: "Last action" })).toHaveText(
    passwordInputAction.visible(false, "page-hide")
  )
})

test("a shown password is never spellchecked, autocorrected or capitalized @enhancement", async ({
  page,
}) => {
  await toggle(page).click()
  await expect(field(page)).toHaveAttribute("spellcheck", "false")
  await expect(field(page)).toHaveAttribute("autocorrect", "off")
  await expect(field(page)).toHaveAttribute("autocapitalize", "off")
})

test("the field asks password managers for the current password, or a new one @enhancement", async ({
  page,
  open,
}) => {
  await expect(field(page)).toHaveAttribute("autocomplete", "current-password")
  await open("password-input", { "new-password": "" })
  await expect(field(page)).toHaveAttribute("autocomplete", "new-password")
})

test("Caps Lock marks the input while the field has focus @enhancement", async ({
  page,
}) => {
  const root = page.locator(".password-input")
  await field(page).focus()
  await field(page).dispatchEvent("keydown", {
    key: "a",
    modifierCapsLock: true,
  })
  await expect(root).toHaveAttribute("data-capslock", "")
  await expect(page.getByText(password.capsLock)).toBeVisible()
  await field(page).dispatchEvent("keyup", {
    key: "a",
    modifierCapsLock: false,
  })
  await expect(root).not.toHaveAttribute("data-capslock")
  await field(page).dispatchEvent("keydown", {
    key: "a",
    modifierCapsLock: true,
  })
  await page.getByRole("button", { name: "After" }).focus()
  await expect(root).not.toHaveAttribute("data-capslock")
})

test("a click into the field with Caps Lock on shows the warning before any key @enhancement", async ({
  page,
}) => {
  await field(page).dispatchEvent("mousedown", {
    button: 0,
    modifierCapsLock: true,
  })
  await expect(page.locator(".password-input")).toHaveAttribute(
    "data-capslock",
    ""
  )
})

test("a web field keeps an autocomplete changed after it connects", async ({
  page,
  framework,
}) => {
  test.skip(framework !== "web", "React and Vue pass autoComplete as a prop.")
  await field(page).evaluate((el) =>
    el.setAttribute("autocomplete", "new-password")
  )
  await toggle(page).click()
  await page.keyboard.type("x")
  await expect(field(page)).toHaveAttribute("autocomplete", "new-password")
})

test("the toggle has its own id and controls the field @enhancement", async ({
  page,
}) => {
  const id = await field(page).getAttribute("id")
  expect(id).toBeTruthy()
  await expect(toggle(page)).toHaveAttribute("aria-controls", id!)
  expect(await page.locator(`[id="${id}"]`).count()).toBe(1)
})

test("a disabled fieldset disables the toggle too @enhancement", async ({
  page,
}) => {
  await page
    .getByRole("group", { name: form.account })
    .evaluate((el) => ((el as HTMLFieldSetElement).disabled = true))
  await expect(field(page)).toBeDisabled()
  await expect(toggle(page)).toHaveAttribute("data-disabled", "")
  await toggle(page).evaluate((el) => (el as HTMLElement).click())
  await expect(field(page)).toHaveAttribute("type", "password")
})
