import { dev, warn } from "#dev"
import { checkName } from "#name-check"
import type { FieldErrorProps, FieldErrorState } from "./field"

// Field parts outside a Field render as plain elements with no field wiring,
// so a FieldLabel can wrap a whole Field, like a choice card, and label the
// control inside it the way any native <label> does. Adapters render them
// with what this module gives, and check their elements through it.

type FieldOutsideSlot = "label" | "description" | "error" | "control"

// What a part outside a field shows: no field disables, requires or invalidates it.
const fieldOutsideState: FieldErrorState = {
  disabled: false,
  required: false,
  focused: false,
  invalid: false,
  valid: false,
  message: "",
}

// Only the slot, so styles that select a part still match it.
const fieldOutsideAttrs = (slot: FieldOutsideSlot) => ({ "data-slot": `field-${slot}` })

// No validation decides an error outside a field, so only `match` shows it.
const fieldOutsideErrorShown = (props: FieldErrorProps) => props.match === true

// Each element is checked once, though a framework may hand it over again,
// like React's strict mode.
const checked = new WeakSet<Element>()

/**
 * In development, warns when a part outside a field leaves a control without
 * a label: a label that labels no control, or a control nothing names. A
 * label's control may render after it, so the check waits a task.
 */
function checkFieldOutside(el: Element | null | undefined, slot: FieldOutsideSlot) {
  if (!dev || !el || checked.has(el)) return
  checked.add(el)
  const from = { component: "field" }
  if (slot === "control") return checkName(el as HTMLElement, "A FieldControl outside a Field", from)
  if (slot !== "label") return
  setTimeout(() => {
    if (!el.isConnected || (el instanceof HTMLLabelElement && el.control)) return
    warn(
      "A FieldLabel outside a Field labels nothing. Put the control inside it, or point its `for` at the control.",
      from,
    )
  })
}

export {
  checkFieldOutside,
  fieldOutsideAttrs,
  fieldOutsideErrorShown,
  type FieldOutsideSlot,
  fieldOutsideState,
}
