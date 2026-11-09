import { expect, test } from "../fixtures"
import { textbox } from "./form.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("text fields hydrate without mismatches", async ({ page, open }) => {
  await open("form")
  await textbox(page, "Username").fill("ada")
  await expect(textbox(page, "Username")).toHaveAttribute("data-filled", "")
  expect(await hydrationErrors(page)).toEqual([])
})

test("errors from the server hydrate without mismatches", async ({
  page,
  open,
}) => {
  await open("form", { errors: "" })
  await expect(page.getByText("This email bounced.")).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server markup shows errors from the server before hydration", async ({
  page,
  open,
}) => {
  await open("form", { hydrate: "manual", errors: "" })
  await expect(page.getByText("This email bounced.")).toBeVisible()
  await expect(page.getByText("Too long. No links allowed.")).toBeVisible()
  await expect(textbox(page, "Email")).toHaveAttribute("aria-invalid", "true")
})

test("the server markup names fields and groups before hydration", async ({
  page,
  open,
}) => {
  await open("form", { hydrate: "manual" })
  await expect(textbox(page, "Username")).toBeVisible()
  await expect(page.getByRole("group", { name: "Profile" })).toBeVisible()
  await expect(textbox(page, "Email")).toHaveValue("ada@example.com")
})

test("a disabled fieldset disables its controls before hydration", async ({
  page,
  open,
}) => {
  await open("form", { hydrate: "manual", disabled: "" })
  await expect(textbox(page, "Username")).toBeDisabled()
})
