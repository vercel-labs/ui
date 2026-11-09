import { expect, test } from "../fixtures"
import {
  checkbox,
  fillRequired,
  formData,
  radio,
  save,
  submitted,
  switchNamed,
} from "./forms.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("form controls hydrate without mismatches", async ({ page, open }) => {
  await open("forms")
  await checkbox(page, "Accept the terms").click()
  await expect(checkbox(page, "Accept the terms")).toBeChecked()
  expect(await hydrationErrors(page)).toEqual([])
})

test("form controls with values hydrate without mismatches", async ({
  page,
  open,
}) => {
  await open("forms", { plan: "pro", readonly: "" })
  await expect(radio(page, "Pro")).toBeChecked()
  expect(await hydrationErrors(page)).toEqual([])
})

test(
  "the server markup submits the defaults before hydration",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms", { hydrate: "manual", plan: "pro" })
    expect(await formData(page)).toBe("toppings=cheese&wifi=on&plan=pro&email=")
  }
)

test(
  "the server markup validates before hydration",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms", { hydrate: "manual" })
    const valid = await page.evaluate(() =>
      document.querySelector("form")!.checkValidity()
    )
    expect(valid).toBe(false)
    const required = await page.evaluate(() =>
      Array.from(document.querySelectorAll("input[required]")).map(
        (el) => (el as HTMLInputElement).type
      )
    )
    expect(required).toEqual([
      "checkbox",
      "radio",
      "radio",
      "radio",
      "radio",
      "email",
    ])
  }
)

test(
  "the server markup has one tab stop per radio group",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("forms", { hydrate: "manual" })
    const stops = await page.evaluate(
      () =>
        Array.from(
          document.querySelectorAll('[role="radio"][tabindex="0"]')
        ).map((el) => el.textContent ?? el.id).length
    )
    expect(stops).toBe(1)
  }
)

test("controls work after hydrating late", async ({ page, open }) => {
  await open("forms", { hydrate: "manual" })
  await page.evaluate(() =>
    (window as unknown as { hydrate: () => void }).hydrate()
  )
  await expect(switchNamed(page, "Wi-Fi")).toBeChecked()
  await fillRequired(page)
  await save(page)
  await expect.poll(() => submitted(page)).toContain("plan=pro")
  expect(await hydrationErrors(page)).toEqual([])
})
