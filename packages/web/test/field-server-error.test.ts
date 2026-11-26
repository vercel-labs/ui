// @vitest-environment jsdom
// A page can write a server's message into an empty error, as the forms guide does.
import { beforeAll, expect, test } from "vitest"
import { defineFieldElements } from "../src/field"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => defineFieldElements())

async function mount() {
  document.body.innerHTML = `<form><ui-field name="email"><ui-field-label>Email</ui-field-label><input type="email" required value="taken@example.com" /><ui-field-error></ui-field-error></ui-field></form>`
  await wait()
  const field = document.querySelector("ui-field") as HTMLElement & {
    invalid?: boolean
  }
  const error = document.querySelector("ui-field-error") as HTMLElement
  return { field, error }
}

test("a message written after invalid stays", async () => {
  const { field, error } = await mount()
  field.invalid = true
  error.textContent = "That email is already taken."
  await wait()
  expect(error.textContent).toBe("That email is already taken.")
  expect(error.hidden).toBe(false)
})

test("a message written before invalid stays", async () => {
  const { field, error } = await mount()
  error.textContent = "That email is already taken."
  field.invalid = true
  await wait()
  expect(error.textContent).toBe("That email is already taken.")
})

test("an error the page empties shows the current message again", async () => {
  const { field, error } = await mount()
  field.invalid = true
  error.textContent = "That email is already taken."
  await wait()
  error.textContent = ""
  field.invalid = undefined
  const input = document.querySelector("input")!
  input.value = ""
  input.dispatchEvent(new Event("input", { bubbles: true }))
  input.dispatchEvent(new Event("invalid", { cancelable: true }))
  await wait()
  expect(error.dataset.message).toBe("")
  expect(error.textContent).toBe(input.validationMessage)
})
