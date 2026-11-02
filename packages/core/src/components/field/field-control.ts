import { formInternals } from "../../foundation/forms/form"

// Reading a field's controls from the DOM: which elements take part in
// validation, which one the field wires to its parts, and their validity.

/**
 * The browser's validity flags, as `ValidityState` names them.
 * @stable
 */
type ValidityKey =
  | "valueMissing"
  | "typeMismatch"
  | "patternMismatch"
  | "tooLong"
  | "tooShort"
  | "rangeUnderflow"
  | "rangeOverflow"
  | "stepMismatch"
  | "badInput"
  | "customError"

const validityKeys: ValidityKey[] = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "tooLong",
  "tooShort",
  "rangeUnderflow",
  "rangeOverflow",
  "stepMismatch",
  "badInput",
  "customError",
]

type Validity = {
  valid: boolean
  flags: Partial<Record<ValidityKey, boolean>>
  message: string
}

const valid: Validity = { valid: true, flags: {}, message: "" }

// Elements that take part in constraint validation.
function validates(el: Element) {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement ||
    !!formInternals(el as HTMLElement) ||
    isFormAssociated(el)
  )
}

// Another library's form-associated custom element, which reports its
// validity the way native controls do.
function isFormAssociated(el: Element) {
  return !!(el.constructor as { formAssociated?: boolean }).formAssociated && "validity" in el
}

// The form controls inside a field, not counting nested fields.
function controlsIn(root: HTMLElement) {
  return Array.from(root.querySelectorAll("*")).filter(
    (el) =>
      validates(el) &&
      (el as HTMLInputElement).type !== "hidden" &&
      el.closest('[data-slot="field-root"]') === root,
  ) as HTMLElement[]
}

function validityOf(el: HTMLElement) {
  const internals = formInternals(el)
  const target = internals ?? (el as HTMLInputElement)
  return { willValidate: target.willValidate, validity: target.validity, message: target.validationMessage }
}

// The element a field wires to its label and messages: a control of this
// package, or the first native one. A radio is the control of a field around
// it alone. A field around its whole group finds the group first, since it
// comes first in the page.
const controlSelector =
  '[data-slot="slider-root"],[data-slot="date-input-root"],[data-slot="time-input-root"],input:not([type="hidden"]):not([aria-hidden="true"]),select,textarea,[data-slot="checkbox-group"],[role="checkbox"],[role="switch"],[role="radiogroup"],[role="radio"],[role="combobox"],[role="slider"],[role="spinbutton"],[role="textbox"],[role="listbox"],[data-slot="file-input-trigger"]'

// A slider with several thumbs is a group the label names, ahead of its
// thumbs. One thumb is the control itself. Checked here rather than with
// `:has()`, which would make the whole selector throw where it's unsupported.
const isSingleSlider = (el: HTMLElement) =>
  el.matches('[data-slot="slider-root"]') && !el.querySelector('[data-slot="slider-thumb"][data-index="1"]')

/**
 * The control a field wires to its label and messages: a ui-sdk control inside
 * `root`, or its first native one.
 */
function findControl(root: HTMLElement) {
  for (const el of Array.from(root.querySelectorAll<HTMLElement>(controlSelector)))
    if (el.closest('[data-slot="field-root"]') === root && !isSingleSlider(el)) return el
}

// Whether a control says it's required. Our own controls mark the hidden input
// or the element, and groups say `aria-required`.
const isRequired = (el: HTMLElement) =>
  el.hasAttribute("required") || el.getAttribute("aria-required") === "true"

export {
  controlsIn,
  findControl,
  isRequired,
  valid,
  type Validity,
  type ValidityKey,
  validityKeys,
  validityOf,
}
