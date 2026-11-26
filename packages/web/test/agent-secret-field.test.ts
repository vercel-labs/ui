// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { defineFieldElements } from "../src/field"
import { defineInputElements } from "../src/input"
import { definePasswordInputElements } from "../src/password-input"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineFieldElements()
  defineInputElements()
  definePasswordInputElements()
})

const fields = () =>
  createAgent()
    .snapshot()
    .filter((entry) => entry.component === "field")

test("a field around a password input keeps its error text secret", async () => {
  document.body.innerHTML = `
    <form>
      <ui-field name="password">
        <ui-field-label>Password</ui-field-label>
        <ui-input><input type="password" required /></ui-input>
        <ui-field-error match="valueMissing">Enter your password.</ui-field-error>
      </ui-field>
    </form>`
  await wait()
  document.querySelector("input")!.checkValidity()
  await wait()
  const [field] = fields()
  expect(field.errors).toEqual(["[redacted]"])
  expect(field.text).toEqual(["[redacted]"])
  expect(JSON.stringify(createAgent().snapshot())).not.toContain(
    "Enter your password"
  )
})

test("a field around a password input showing its text keeps its error text secret", async () => {
  document.body.innerHTML = `
    <form>
      <ui-field name="password">
        <ui-field-label>Password</ui-field-label>
        <ui-password-input required>
          <input />
          <ui-password-input-toggle><button type="button" aria-label="Show password"></button></ui-password-input-toggle>
        </ui-password-input>
        <ui-field-error match="valueMissing">Enter your password.</ui-field-error>
      </ui-field>
    </form>`
  await wait()
  document.querySelector("button")!.click()
  await wait()
  expect(document.querySelector("input")!.type).toBe("text")
  document
    .querySelector("ui-password-input")!
    .dispatchEvent(new Event("invalid"))
  for (const input of document.querySelectorAll("input")) input.checkValidity()
  await wait()
  expect(JSON.stringify(createAgent().snapshot())).not.toContain(
    "Enter your password"
  )
})

test.each([
  `<div data-agent-secret><ui-input><input required /></ui-input></div>`,
  `<div data-agent-secret><input required /></div>`,
  `<select required autocomplete="cc-exp-month"><option value=""></option></select>`,
])(
  "a field around a secret control keeps its error text secret: %s",
  async (control) => {
    document.body.innerHTML = `
    <form>
      <ui-field name="secret">
        <ui-field-label>Secret</ui-field-label>
        ${control}
        <ui-field-error match="valueMissing">Fill this in.</ui-field-error>
      </ui-field>
    </form>`
    await wait()
    document.querySelector("input, select")!.dispatchEvent(new Event("invalid"))
    ;(
      document.querySelector("input, select") as HTMLInputElement
    ).checkValidity()
    await wait()
    expect(JSON.stringify(createAgent().snapshot())).not.toContain(
      "Fill this in"
    )
  }
)

test("a field around a plain input keeps its error text", async () => {
  document.body.innerHTML = `
    <form>
      <ui-field name="email">
        <ui-field-label>Email</ui-field-label>
        <ui-input><input type="email" required /></ui-input>
        <ui-field-error match="valueMissing">Enter your email.</ui-field-error>
      </ui-field>
    </form>`
  await wait()
  document.querySelector("input")!.checkValidity()
  await wait()
  const [field] = fields()
  expect(field.text).toEqual(["Enter your email."])
})
