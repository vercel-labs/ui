import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  radioGroup,
  type RadioGroupOptions,
  type RadioIndicatorState,
  type RadioProps,
} from "@ui-sdk/core/radio"
import { optionalBoolean } from "./inputs.ts"
import { emitTypedChange } from "./outputs.ts"
import {
  FieldContext,
  useFieldControl,
  type FieldScope,
} from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type RadioGroupValueChange<Value extends string = string> = Parameters<
  NonNullable<RadioGroupOptions<Value>["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<RadioGroupOptions<Value>["onValueChange"]>>[0]
}

// The field each group is in, which its radios leave to the group.
const groupFields = new WeakMap<object, FieldScope | null>()

/**
 * Radios that share one value, with one tab stop and arrow keys between them.
 * @experimental
 */
@Directive({ selector: "[uiRadioGroup]", exportAs: "uiRadioGroup" })
class RadioGroup<Value extends string = string> {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The checked radio's value. Bind it with `[(value)]` to control the group. `null` checks nothing. */
  readonly value: InputSignal<RadioGroupOptions<Value>["value"]> = input()
  /** The radio checked at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<RadioGroupOptions<Value>["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<RadioGroupValueChange<Value>["value"]>()
  /** Runs when a user or a form reset wants to change the value. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<RadioGroupValueChange<Value>>()
  /** Disables every radio like native ones: they can't be focused or changed, and the value isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the items focusable and the value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until an item is checked, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. Without one, the group submits nothing. */
  readonly name: InputSignal<RadioGroupOptions["name"]> = input()
  /** The id of a form to belong to, when the group isn't inside that form. */
  readonly form: InputSignal<RadioGroupOptions["form"]> = input()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Checks radios from anywhere. Create one with `createRadioGroupController()`. */
  readonly controller: InputSignal<RadioGroupOptions["controller"]> = input()

  readonly handle = usePrimitive(radioGroup, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitTypedChange(this.beforeValueChange, this.valueChange),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    loop: this.loop(),
    controller: this.controller(),
  }))
  /** The radio group's state, as a signal. */
  readonly state = usePart(this.handle, "group", undefined, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    groupFields.set(this, inject(FieldContext, { optional: true }))
  }
}

/**
 * A radio and the hidden native radio that takes part in the form.
 * @experimental
 */
@Directive({ selector: "[uiRadio]", exportAs: "uiRadio" })
class Radio {
  readonly #group = inject(RadioGroup)
  // A radio in a field of its own is that field's control. In the group's field, the group is.
  readonly #field =
    inject(FieldContext, { optional: true }) === groupFields.get(this.#group)
      ? undefined
      : useFieldControl()
  /** What the group's value becomes when this item is checked. */
  readonly value = input.required<RadioProps["value"]>()
  /** Skips the item, like a disabled native radio: arrow keys pass it and it can't be focused or checked. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  readonly #item = () => ({
    value: this.value(),
    disabled: this.disabled() || this.#field?.disabled(),
  })
  /** The radio's state, as a signal. */
  readonly state = usePart(this.#group.handle, "root", this.#item, {
    joined: this.#field?.joined,
  }).state

  constructor() {
    useNativeInput(this.#group.handle, "input", this.#item)
  }
}

/**
 * The dot inside the radio. Rendered while it's checked, or always with `keepMounted`. `*uiRadioIndicator` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiRadioIndicator]", exportAs: "uiRadioIndicator" })
class RadioIndicator {
  readonly #root = inject(Radio, { optional: true })

  /** Whether the indicator stays in the page while its item is unchecked. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(RadioGroup).handle, "indicator", () => ({
    value: this.#root?.value(),
    keepMounted: this.keepMounted(),
  })).state

  static ngTemplateContextGuard(
    _directive: RadioIndicator,
    context: unknown
  ): context is { $implicit: RadioIndicatorState } {
    return true
  }
}

export { createRadioGroupController } from "@ui-sdk/core/radio"
export type {
  RadioGroupApi,
  RadioGroupChangeOptions,
  RadioGroupController,
  RadioGroupOptions,
  RadioGroupPrimitive,
  RadioGroupState,
  RadioGroupValueChangeReason,
  RadioIndicatorProps,
  RadioIndicatorState,
  RadioProps,
  RadioState,
} from "@ui-sdk/core/radio"

export { Radio, RadioGroup, type RadioGroupValueChange, RadioIndicator }
