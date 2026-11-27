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
  return (
    !!(el.constructor as { formAssociated?: boolean }).formAssociated &&
    "validity" in el
  )
}

// A field's root can keep a slot of its own, like an element it takes with
// `as-child`, so a bound root counts as a field whatever its slot says.
const roots = new WeakSet<Element>()

function holdRoot(el: HTMLElement) {
  roots.add(el)
  return () => roots.delete(el)
}

function fieldOf(el: Element) {
  const slotted = el.closest('[data-slot="field"]')
  for (
    let node: Element | null = el;
    node && node !== slotted;
    node = node.parentElement
  ) {
    if (roots.has(node)) {
      return node
    }
  }
  return slotted
}

// The form controls inside a field, not counting nested fields.
function controlsIn(root: HTMLElement) {
  return Array.from(root.querySelectorAll("*")).filter(
    (el) =>
      validates(el) &&
      (el as HTMLInputElement).type !== "hidden" &&
      fieldOf(el) === root
  ) as HTMLElement[]
}

function validityOf(el: HTMLElement) {
  const internals = formInternals(el)
  const target = internals ?? (el as HTMLInputElement)
  return {
    willValidate: target.willValidate,
    validity: target.validity,
    message: target.validationMessage,
  }
}

// Whether a control says it's required. Our own controls mark the hidden input
// or the element, and groups say `aria-required`.
const isRequired = (el: HTMLElement) =>
  el.hasAttribute("required") || el.getAttribute("aria-required") === "true"

export {
  controlsIn,
  fieldOf,
  holdRoot,
  isRequired,
  valid,
  type Validity,
  type ValidityKey,
  validityKeys,
  validityOf,
}
