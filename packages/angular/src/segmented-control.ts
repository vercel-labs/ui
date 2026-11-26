import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  segmentedControl,
  type SegmentedControlItemProps,
  type SegmentedControlOptions,
} from "@ui-sdk/core/segmented-control"
import { optionalBoolean } from "./inputs.ts"
import { emitChange } from "./outputs.ts"
import { useFieldControl } from "./field-context.ts"
import { useNativeInput } from "./native-input.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type SegmentedControlValueChange = Parameters<
  NonNullable<SegmentedControlOptions["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<SegmentedControlOptions["onValueChange"]>>[0]
}

/**
 * A row of options where exactly one is on, like a radio group drawn as buttons, with an indicator that slides to the checked item.
 * @experimental
 */
@Directive({ selector: "[uiSegmentedControl]", exportAs: "uiSegmentedControl" })
class SegmentedControl {
  readonly #field = useFieldControl()
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The checked item's value. Bind it with `[(value)]` to control the segmented control. `null` checks nothing. */
  readonly value: InputSignal<SegmentedControlOptions["value"]> = input()
  /** The item checked at first, when uncontrolled. A form reset returns to it. */
  readonly defaultValue: InputSignal<SegmentedControlOptions["defaultValue"]> =
    input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<SegmentedControlValueChange["value"]>()
  /** Runs when a user or a form reset wants to change the value. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<SegmentedControlValueChange>()
  /** Disables every item: they can't be focused or changed, and the value isn't submitted. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps the items focusable and the value submitted, but stops changes. */
  readonly readOnly = input(undefined, { transform: optionalBoolean })
  /** Blocks form submission until an item is checked, with the browser's own message. */
  readonly required = input(undefined, { transform: optionalBoolean })
  /** The name the value submits under. Without one, the segmented control submits nothing. */
  readonly name: InputSignal<SegmentedControlOptions["name"]> = input()
  /** The id of a form to belong to, when the segmented control isn't inside that form. */
  readonly form: InputSignal<SegmentedControlOptions["form"]> = input()
  /** Whether arrow keys wrap from the last item to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Which way the items run, for styling and for screen readers. Arrow keys on both axes move between items either way, as in any radio group. */
  readonly orientation: InputSignal<SegmentedControlOptions["orientation"]> =
    input()
  /** Checks items from anywhere. Create one with `createSegmentedControlController()`. */
  readonly controller: InputSignal<SegmentedControlOptions["controller"]> =
    input()

  readonly handle = usePrimitive(segmentedControl, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
    disabled: this.disabled() || this.#field?.disabled(),
    readOnly: this.readOnly(),
    required: this.required(),
    name: this.name() ?? this.#field?.name(),
    form: this.form(),
    loop: this.loop(),
    orientation: this.orientation(),
    controller: this.controller(),
  }))
  /** The segmented control's state, as a signal. */
  readonly state = usePart(this.handle, "root", undefined, {
    joined: this.#field?.joined,
  }).state
}

/**
 * One option, and the hidden native radio that takes part in the form.
 * @experimental
 */
@Directive({
  selector: "[uiSegmentedControlItem]",
  exportAs: "uiSegmentedControlItem",
})
class SegmentedControlItem {
  /** What the value becomes when this item is checked. */
  readonly value = input.required<SegmentedControlItemProps["value"]>()
  /** Skips the item, like a disabled native radio: arrow keys pass it and it can't be focused or checked. */
  readonly disabled = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(SegmentedControl).handle, "item", () => ({
    value: this.value(),
    disabled: this.disabled(),
  })).state

  constructor() {
    useNativeInput(inject(SegmentedControl).handle, "input", () => ({
      value: this.value(),
      disabled: this.disabled(),
    }))
  }
}

/**
 * Sits behind the checked item. Its box comes from the `--segmented-control-indicator-*` variables, measured from the root.
 * @experimental
 */
@Directive({
  selector: "[uiSegmentedControlIndicator]",
  exportAs: "uiSegmentedControlIndicator",
})
class SegmentedControlIndicator {
  /** Whether it follows the item under the pointer, and goes back to the checked one when the pointer leaves the control. */
  readonly followHover = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(
    inject(SegmentedControl).handle,
    "indicator",
    () => ({ followHover: this.followHover() })
  ).state
}

export { createSegmentedControlController } from "@ui-sdk/core/segmented-control"
export type {
  SegmentedControlApi,
  SegmentedControlChangeOptions,
  SegmentedControlController,
  SegmentedControlDirection,
  SegmentedControlIndicatorProps,
  SegmentedControlIndicatorState,
  SegmentedControlItemProps,
  SegmentedControlItemState,
  SegmentedControlOptions,
  SegmentedControlOrientation,
  SegmentedControlPrimitive,
  SegmentedControlState,
  SegmentedControlValueChangeReason,
} from "@ui-sdk/core/segmented-control"

export {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
  type SegmentedControlValueChange,
}
