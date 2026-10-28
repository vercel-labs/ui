import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { fieldChoiceCardFixture as f } from "../fixtures/field"
import { checkbox, email, errors, fillRequired, radio, save } from "./forms.helpers"

// A field names its control from its label, describes it with its description,
// and shows errors from the browser's constraint validation once a submit
// finds them, unless the page says whether it's invalid.

test.describe("labelling", () => {
  test.beforeEach(async ({ open }) => {
    await open("forms")
  })

  test("the label names the control", async ({ page }) => {
    await expect(checkbox(page, "Accept the terms")).toBeVisible()
    await expect(page.getByRole("radiogroup", { name: "Plan" })).toBeVisible()
    await expect(email(page)).toBeVisible()
  })

  test("the description describes the control", async ({ page }) => {
    await expect(checkbox(page, "Accept the terms")).toHaveAccessibleDescription(
      "You must accept them to continue.",
    )
    await expect(email(page)).toHaveAccessibleDescription("We never share it.")
  })

  test("clicking the label of a text field focuses it", async ({ page }) => {
    await page.getByText("Email", { exact: true }).click()
    await expect(email(page)).toBeFocused()
  })
})

// Choice cards: a FieldLabel outside any Field wraps a whole Field, and labels
// the control inside it the way a native <label> does.
test.describe("a label wrapping a field", () => {
  const card = (page: Page, title: string) => page.getByRole("checkbox", { name: title })

  test("names the control inside it", async ({ page, open }) => {
    await open("field-choice-card")
    for (const { title } of f.cards) await expect(card(page, title)).toBeVisible()
  })

  test("checks its control when clicked anywhere", async ({ page, open }) => {
    await open("field-choice-card")
    const [first, second] = f.cards
    await page.getByText(first.description).click()
    await expect(card(page, first.title)).toBeChecked()
    await expect(card(page, second.title)).not.toBeChecked()
    await page.getByText(first.title).click()
    await expect(card(page, first.title)).not.toBeChecked()
  })

  test("keeps the field's description on its control", async ({ page, open }) => {
    await open("field-choice-card")
    for (const { title, description } of f.cards)
      await expect(card(page, title)).toHaveAccessibleDescription(description)
  })

  test("warns in development only when a label outside a field labels nothing", async ({ page, open }) => {
    const printed: string[] = []
    page.on("console", (message) => message.type() === "warning" && printed.push(message.text()))
    await open("field-choice-card", { alone: "" })
    await expect(page.getByText(f.alone)).toBeVisible()
    const unlabeled = () => printed.filter((text) => text.includes("labels nothing"))
    await expect.poll(() => unlabeled().length).toBe(1)
  })
})

test.describe("errors", () => {
  test("stay hidden until the form tries to submit", async ({ page, open }) => {
    await open("forms")
    await email(page).fill("not an email")
    await email(page).blur()
    await expect(errors(page)).toHaveCount(0)
    await expect(email(page)).not.toHaveAttribute("aria-invalid", "true")
    await save(page)
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible()
    await expect(checkbox(page, "Accept the terms")).toHaveAttribute("aria-invalid", "true")
    await expect(email(page)).toHaveAttribute("aria-invalid", "true")
  })

  test("show the browser's message when they have no text of their own", async ({ page, open }) => {
    await open("forms")
    await email(page).fill("not an email")
    await save(page)
    const message = await email(page).evaluate((el: HTMLInputElement) => el.validationMessage)
    expect(message).not.toBe("")
    await expect(page.getByText(message, { exact: true })).toBeVisible()
  })

  test("count another library's form-associated element inside the field", async ({ page, open }) => {
    await open("forms")
    await email(page).fill("ada@example.com")
    // A form-associated custom element with its own ElementInternals, the way
    // other component libraries build them.
    await page.evaluate(() => {
      class Picker extends HTMLElement {
        static formAssociated = true
        internals = this.attachInternals()
        connectedCallback() {
          this.internals.setValidity({ valueMissing: true }, "Pick a color.")
        }
        get validity() {
          return this.internals.validity
        }
        get willValidate() {
          return this.internals.willValidate
        }
        get validationMessage() {
          return this.internals.validationMessage
        }
      }
      customElements.define("third-party-picker", Picker)
      const field = document.querySelector('[data-slot="field-root"]:has(input[type="email"])')!
      field.append(document.createElement("third-party-picker"))
    })
    await save(page)
    await expect(page.getByText("Pick a color.", { exact: true })).toBeVisible()
  })

  test("describe the control while they show", async ({ page, open }) => {
    await open("forms")
    await save(page)
    await expect(checkbox(page, "Accept the terms")).toHaveAccessibleDescription(
      "You must accept them to continue. Accept the terms to continue.",
    )
  })

  test("update as the value changes once shown", async ({ page, open }) => {
    await open("forms")
    await save(page)
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible()
    await checkbox(page, "Accept the terms").click()
    await expect(page.getByText("Accept the terms to continue.")).toBeHidden()
    await expect(checkbox(page, "Accept the terms")).not.toHaveAttribute("aria-invalid", "true")
    await radio(page, "Pro").click()
    await email(page).fill("ada@example.com")
    await expect(errors(page)).toHaveCount(0)
  })

  test(
    "a field marked invalid shows its error right away",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("forms", { invalid: "" })
      await expect(email(page)).toHaveAttribute("aria-invalid", "true")
      await expect(errors(page)).toHaveCount(1)
    },
  )

  test(
    "a field marked valid never shows the browser's errors",
    { tag: "@enhancement" },
    async ({ page, open }) => {
      await open("forms", { invalid: "false" })
      await fillRequired(page)
      await email(page).fill("not an email")
      await save(page)
      await expect(email(page)).toBeFocused()
      await expect(email(page)).not.toHaveAttribute("aria-invalid", "true")
      await expect(errors(page)).toHaveCount(0)
    },
  )

  test("a form reset hides them again", { tag: "@enhancement" }, async ({ page, open }) => {
    await open("forms")
    await save(page)
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect(errors(page)).toHaveCount(0)
    await expect(checkbox(page, "Accept the terms")).not.toHaveAttribute("aria-invalid", "true")
  })

  test("errors in the page replace the browser's message, and the first invalid control takes focus", async ({
    page,
    open,
  }) => {
    await open("forms")
    await email(page).focus()
    await save(page)
    await expect(checkbox(page, "Accept the terms")).toBeFocused()
    await expect(page.getByText("Accept the terms to continue.")).toBeVisible()
  })
})
