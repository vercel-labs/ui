import type { Locator } from "@playwright/test"

// The validity of what takes part in the form for a date picker's input: the
// form-associated <ui-date-picker> around it in web components, else the input.
const validity = (input: Locator) =>
  input.evaluate((el: HTMLInputElement) => {
    // A form-associated element exposes its validity like a native control.
    const picker = el.closest("ui-date-picker") as
      | (HTMLElement & { validity: ValidityState; validationMessage: string })
      | null
    const control = picker ?? el
    return { valid: control.validity.valid, message: control.validationMessage }
  })

const invalidDate = { valid: false, message: "Enter a valid date." }

export { invalidDate, validity }
