import { expect, test } from "../fixtures"
import {
  checkbox,
  email,
  fillRequired,
  form,
  formData,
  radio,
  save,
  submitted,
  switchNamed,
} from "./forms.helpers"

// Native form participation: every control submits, resets and validates with
// a plain <form>, like the native control it stands for.

test.beforeEach(async ({ open }) => {
  await open("forms")
})

test("the form submits every checked control's name and value", async ({
  page,
}) => {
  await fillRequired(page)
  await save(page)
  await expect
    .poll(() => submitted(page))
    .toBe("terms=yes&toppings=cheese&wifi=on&plan=pro&email=ada%40example.com")
})

test("unchecked controls submit nothing", async ({ page }) => {
  expect(await formData(page)).not.toContain("airplane")
  await switchNamed(page, "Airplane mode").click()
  expect(await formData(page)).toContain("airplane=on")
  await switchNamed(page, "Wi-Fi").click()
  expect(await formData(page)).not.toContain("wifi")
})

test("a checkbox outside the form joins it with the form attribute", async ({
  page,
}) => {
  await checkbox(page, "Newsletter").click()
  await expect.poll(() => formData(page)).toContain("newsletter=weekly")
})

test("required controls block submission", async ({ page }) => {
  await save(page)
  await page.waitForTimeout(100)
  expect(await submitted(page)).toBe("")
  expect(
    await form(page).evaluate((el: HTMLFormElement) => el.checkValidity())
  ).toBe(false)
  await fillRequired(page)
  expect(
    await form(page).evaluate((el: HTMLFormElement) => el.checkValidity())
  ).toBe(true)
})

test(
  "a form reset returns every control to its default",
  { tag: "@enhancement" },
  async ({ page }) => {
    await fillRequired(page)
    await checkbox(page, "Olives").click()
    await switchNamed(page, "Wi-Fi").click()
    await switchNamed(page, "Airplane mode").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(checkbox(page, "Accept the terms")).not.toBeChecked()
    await expect(checkbox(page, "Olives")).not.toBeChecked()
    await expect(checkbox(page, "Cheese")).toBeChecked()
    await expect(checkbox(page, "All toppings")).toHaveAttribute(
      "aria-checked",
      "mixed"
    )
    await expect(switchNamed(page, "Wi-Fi")).toBeChecked()
    await expect(switchNamed(page, "Airplane mode")).not.toBeChecked()
    await expect(radio(page, "Pro")).not.toBeChecked()
    await expect(email(page)).toHaveValue("")
    expect(await formData(page)).toBe("toppings=cheese&wifi=on&email=")
  }
)

test(
  "a reset returns to the default value, not to nothing",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms", { plan: "free" })
    await radio(page, "Enterprise").click()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(radio(page, "Free")).toBeChecked()
    await expect(radio(page, "Enterprise")).not.toBeChecked()
  }
)

test(
  "a disabled fieldset disables the controls inside it",
  { tag: "@enhancement" },
  async ({ page }) => {
    const gift = checkbox(page, "Gift wrap")
    await gift.click()
    await expect.poll(() => formData(page)).toContain("gift=on")
    await page.getByRole("button", { name: "Toggle shipping" }).click()
    await expect(gift).toBeDisabled()
    expect(await formData(page)).not.toContain("gift")
    await gift.click({ force: true })
    await expect(gift).toBeChecked()
    await page.getByRole("button", { name: "Toggle shipping" }).click()
    await expect(gift).toBeEnabled()
    expect(await formData(page)).toContain("gift=on")
  }
)

test("a read-only control still submits", async ({ page, open }) => {
  await open("forms", { readonly: "", plan: "pro" })
  expect(await formData(page)).toContain("plan=pro")
})

test("a user's change fires native input and change events on the form", async ({
  page,
}) => {
  await page.evaluate(() => {
    const form = document.querySelector("form")!
    ;(window as unknown as { events: string[] }).events = []
    for (const type of ["input", "change"]) {
      form.addEventListener(type, () =>
        (window as unknown as { events: string[] }).events.push(type)
      )
    }
  })
  await checkbox(page, "Olives").click()
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { events: string[] }).events)
    )
    .toEqual(["input", "change"])
})
