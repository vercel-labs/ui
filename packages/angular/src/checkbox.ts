import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  checkbox,
  checkboxGroup,
  type CheckboxGroupOptions,
  type CheckboxIndicatorState,
  type CheckboxOptions,
} from "@ui-sdk/core/checkbox"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import {
  FieldContext,
  type FieldScope,
  useFieldControl,
} from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeCheckedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CheckboxCheckedChange = Parameters<
  NonNullable<CheckboxOptions["onCheckedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CheckboxOptions["onCheckedChange"]>>[0]
}

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type CheckboxGroupValueChange = Parameters<
  NonNullable<CheckboxGroupOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<CheckboxGroupOptions["onValueChange"]>>[0]
}

const checkedState = (value: unknown) =>
  value === "indeterminate"
    ? ("indeterminate" as const)
    : optionalBoolean(value)

// The field each group joined, so a checkbox joins only a field of its own.
const groupFields = new WeakMap<object, FieldScope | null>()

/**
 * The control and the hidden native input that takes part in the form.
 * @experimental
 */
@Directive({ selector: "[uiCheckbox]", exportAs: "uiCheckbox" })
class Checkbox {
  readonly #group = inject(CheckboxGroup, { optional: true })
  readonly #nearest = inject(FieldContext, { optional: true })
  // A checkbox in a field of its own is that field's control. In the group's field, the group is.
  readonly #field =
    this.#nearest &&
    !(this.#group && this.#nearest === groupFields.get(this.#group))
      ? useFieldControl()
      : undefined
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether it's checked. Bind it with `[(checked)]` to control the checkbox. */
  readonly checked = input(undefined, { transform: checkedState })
  /** Whether it's checked at first, when uncontrolled. A form reset returns to it. */
  readonly defaultChecked = input(undefined, { transform: checkedState })
  /** The new value, after a change that wasn't canceled. */
  readonly checkedChange = output<CheckboxCheckedChange["value"]>()
  /** Runs when a user or a form reset wants to change it. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeCheckedChange = output<CheckboxCheckedChange>()
  /** Disables it like a native control: it can't be focused or changed, and isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps it focusable and submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until it's checked, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name it submits under. Without one, it submits nothing. */
  readonly name: InputSignal<CheckboxOptions["name"]> = input()
  /** What it submits while checked. */
  readonly value: InputSignal<CheckboxOptions["value"]> = input()
  /** The id of a form to belong to, when it isn't inside that form. */
  readonly form: InputSignal<CheckboxOptions["form"]> = input()
  /** Toggles it from anywhere. Create one with `createCheckboxController()`. */
  readonly controller: InputSignal<CheckboxOptions["controller"]> = input()
  /** Makes it the parent of its group: it checks or unchecks every checkbox in the group, and shows checked, unchecked or indeterminate from them. */
  readonly parent = input(undefined, { transform: optionalBoolean })

  readonly handle = usePrimitive(checkbox, () => ({
    debug: this.debug(),
    checked: this.checked(),
    defaultChecked: this.defaultChecked(),
    onCheckedChange: emitChange(this.beforeCheckedChange, this.checkedChange),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? (this.#group ? undefined : this.#field?.name()),
    value: this.value(),
    form: this.form(),
    controller: this.controller(),
    parent: this.parent(),
    group: this.#group ? () => this.#group?.handle.api : undefined,
  }))
  /** The checkbox's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.handle, "input")
  }
}

/**
 * The check inside the checkbox. Rendered while it's checked or indeterminate, or always with `keepMounted`. `*uiCheckboxIndicator` renders it only while it's shown.
 * @experimental
 */
@Directive({
  selector: "[uiCheckboxIndicator]",
  exportAs: "uiCheckboxIndicator",
})
class CheckboxIndicator {
  /** Whether the indicator stays in the page while unchecked, so it can be styled or animated in both states. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Checkbox).handle, "indicator", () => ({
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: CheckboxIndicator,
    context: unknown
  ): context is { $implicit: CheckboxIndicatorState } {
    return true
  }
}

/**
 * Checkboxes that share a name and a list of checked values. The group, not each checkbox, sits in a field.
 * @experimental
 */
@Directive({ selector: "[uiCheckboxGroup]", exportAs: "uiCheckboxGroup" })
class CheckboxGroup {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The checked checkboxes' values. Bind it with `[(value)]` to control the group. */
  readonly value: InputSignal<CheckboxGroupOptions["value"]> = input()
  /** The values checked at first, when uncontrolled. A form reset returns to them. */
  readonly defaultValue: InputSignal<CheckboxGroupOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<CheckboxGroupValueChange["value"]>()
  /** Runs when a user or a form reset wants to change the value. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<CheckboxGroupValueChange>()
  /** Every value a parent checkbox checks. Without it, the parent checks the checkboxes in the group. Pass it to render the parent right on the server. */
  readonly allValues: InputSignal<CheckboxGroupOptions["allValues"]> = input()
  /** Disables every checkbox in the group, and leaves them out of the form. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Makes every checkbox in the group read-only: focusable and submitted, but presses don't change it. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until at least one checkbox is checked, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name every checkbox in the group submits under. */
  readonly name: InputSignal<CheckboxGroupOptions["name"]> = input()
  /** The id of a form to belong to, when the group isn't inside that form. */
  readonly form: InputSignal<CheckboxGroupOptions["form"]> = input()
  /** Checks values from anywhere. Create one with `createCheckboxGroupController()`. */
  readonly controller: InputSignal<CheckboxGroupOptions["controller"]> = input()

  readonly handle = usePrimitive(checkboxGroup, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    allValues: this.allValues(),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    controller: this.controller(),
  }))
  /** The checkbox group's state, as a signal. */
  readonly state = usePart(this.handle, "group", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    groupFields.set(this, inject(FieldContext, { optional: true }))
    useNativeInput(this.handle, "group-input")
  }
}

export {
  createCheckboxController,
  createCheckboxGroupController,
} from "@ui-sdk/core/checkbox"
export type {
  CheckboxApi,
  CheckboxChangeOptions,
  CheckboxCheckedChangeReason,
  CheckboxController,
  CheckboxGroupApi,
  CheckboxGroupChangeOptions,
  CheckboxGroupController,
  CheckboxGroupOptions,
  CheckboxGroupPrimitive,
  CheckboxGroupState,
  CheckboxGroupValueChangeReason,
  CheckboxIndicatorProps,
  CheckboxIndicatorState,
  CheckboxOptions,
  CheckboxPrimitive,
  CheckboxState,
  CheckedState,
} from "@ui-sdk/core/checkbox"

export {
  Checkbox,
  type CheckboxCheckedChange,
  CheckboxGroup,
  type CheckboxGroupValueChange,
  CheckboxIndicator,
}
