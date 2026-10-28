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

  test("names a control that renders after it", async ({ page, open }) => {
    await open("field-choice-card", { later: "" })
    await expect(card(page, f.later.title)).toBeVisible()
    await page.getByText(f.later.description).click()
    await expect(card(page, f.later.title)).toBeChecked()
  })

  test("keeps the part's data-slot", async ({ page, open }) => {
    await open("field-choice-card", { alone: "" })
    const cards = page.locator(".choice-card")
    await expect(cards).toHaveCount(f.cards.length)
    for (const label of await cards.all()) await expect(label).toHaveAttribute("data-slot", "field-label")
    await expect(page.getByText(f.alone)).toHaveAttribute("data-slot", "field-label")
  })

  // Every label is checked at once, so a false warning about the card whose
  // control comes later would print before the orphan's.
  test("warns in development only when a label outside a field labels nothing", async ({ page, open }) => {
    const printed: string[] = []
    page.on("console", (message) => message.type() === "warning" && printed.push(message.text()))
    await open("field-choice-card", { alone: "", later: "" })
    await expect(card(page, f.later.title)).toBeVisible()
    const unlabeled = () => printed.filter((text) => text.includes("labels nothing"))
    await expect.poll(() => unlabeled().some((text) => text.includes(f.alone))).toBe(true)
    expect(unlabeled()).toHaveLength(1)
  })

  test("a description and an error outside a field keep their data-slot", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(!framework.startsWith("web"), "Web components write it on an element they don't render.")
    await open("field-choice-card")
    await page.evaluate(() => {
      document.querySelector(".fixture")!.insertAdjacentHTML(
        "beforeend",
        `<ui-field-description>Plain description</ui-field-description>
        <ui-field-error match="true">Plain error</ui-field-error>`,
      )
    })
    await expect(page.getByText("Plain description")).toHaveAttribute("data-slot", "field-description")
    await expect(page.getByText("Plain error")).toHaveAttribute("data-slot", "field-error")
  })

  test("a hidden error outside a field stays hidden whatever display its class gives", async ({
    page,
    open,
    framework,
  }) => {
    test.skip(!framework.startsWith("web"), "Web components hide an element they don't render.")
    await open("field-choice-card")
    await page.evaluate(() => {
      document.head.insertAdjacentHTML("beforeend", "<style>.shown { display: block }</style>")
      document
        .querySelector(".fixture")!
        .insertAdjacentHTML("beforeend", `<ui-field-error class="shown">Plain error</ui-field-error>`)
    })
    await expect(page.getByText("Plain error")).toHaveAttribute("data-slot", "field-error")
    await expect(page.getByText("Plain error")).toBeHidden()
  })

  test("an error outside a field follows its match", async ({ page, open, framework }) => {
    test.skip(!framework.startsWith("web"), "Web components read match from the element's attribute.")
    await open("field-choice-card")
    await page.evaluate(() => {
      document.querySelector(".fixture")!.insertAdjacentHTML(
        "beforeend",
        `<ui-field-error id="plain">Plain error</ui-field-error>
        <ui-field-error id="child" as-child match="true"><p>Child error</p></ui-field-error>`,
      )
    })
    const plain = page.getByText("Plain error")
    const child = page.getByText("Child error")
    await expect(child).toBeVisible()
    await expect(plain).toBeHidden()
    await page.evaluate(() => {
      document.getElementById("plain")!.setAttribute("match", "")
      document.getElementById("child")!.setAttribute("match", "false")
    })
    await expect(plain).toBeVisible()
    await expect(child).toBeHidden()
  })

  test("an error outside a field shows a child that arrives after it", async ({ page, open, framework }) => {
    test.skip(!framework.startsWith("web"), "Web components bind an as-child element when it arrives.")
    await open("field-choice-card")
    await page.evaluate(async () => {
      const error = document.createElement("ui-field-error")
      error.id = "late"
      error.setAttribute("as-child", "")
      document.querySelector(".fixture")!.append(error)
      await new Promise((resolve) => setTimeout(resolve, 30))
      error.innerHTML = "<p>Late error</p>"
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
    const late = page.getByText("Late error")
    await expect(late).toBeHidden()
    await page.evaluate(() => document.getElementById("late")!.setAttribute("match", "true"))
    await expect(late).toBeVisible()
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
