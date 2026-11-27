import {
  Directive,
  inject,
  input,
  output,
  type InputSignal,
} from "@angular/core"
import {
  toggle,
  toggleGroup,
  type ToggleGroupOptions,
  type ToggleOptions,
} from "@ui-sdk/core/toggle"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, emitTypedChange } from "./outputs.ts"
import { useToolbarScope } from "./toolbar-context.ts"
import { usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforePressedChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type TogglePressedChange = Parameters<
  NonNullable<ToggleOptions["onPressedChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<ToggleOptions["onPressedChange"]>>[0]
}

/**
 * What `(beforeValueChange)` emits: the value about to be set, why, and `cancel()` to keep the current one.
 * @experimental
 */
type ToggleGroupValueChange<Value extends string = string> = Parameters<
  NonNullable<ToggleGroupOptions<Value>["onValueChange"]>
>[1] & {
  /** The value the change would set. */
  value: Parameters<NonNullable<ToggleGroupOptions<Value>["onValueChange"]>>[0]
}

/**
 * A button that stays pressed. Inside a ToggleGroup, the group decides whether it's pressed.
 * @experimental
 */
@Directive({ selector: "[uiToggle]", exportAs: "uiToggle" })
class Toggle {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** Whether it's pressed. Bind it with `[(pressed)]` to control the toggle. Inside a group, the group's value decides. */
  readonly pressed = input(undefined, { transform: optionalBoolean })
  /** Whether it's pressed at first, when uncontrolled. */
  readonly defaultPressed = input(undefined, { transform: optionalBoolean })
  /** The new value, after a change that wasn't canceled. */
  readonly pressedChange = output<TogglePressedChange["value"]>()
  /** Runs when a press wants to change it. `$event.reason` says why, and `$event.cancel()` stops it. Inside a group, it runs before the group's `(beforeValueChange)`, and canceling it cancels the group's change too. */
  readonly beforePressedChange = output<TogglePressedChange>()
  /** Identifies the toggle inside a group, whose value lists the pressed toggles' values. Defaults to a generated id. */
  readonly value: InputSignal<ToggleOptions["value"]> = input()
  /** Stops presses. Alone, the toggle is natively disabled, unless `focusableWhenDisabled` is set. Inside a group or a toolbar, it stays focusable with `aria-disabled`, so arrow keys still reach it. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Keeps a disabled toggle in the tab order with `aria-disabled` instead of the native attribute. Toggles in a group or a toolbar always are. */
  readonly focusableWhenDisabled = input(undefined, {
    transform: optionalBoolean,
  })
  /** Presses it from anywhere. Create one with `createToggleController()`. */
  readonly controller: InputSignal<ToggleOptions["controller"]> = input()
  readonly #group = inject(ToggleGroup, { optional: true })
  readonly #toolbar = useToolbarScope()

  readonly handle = usePrimitive(toggle, () => ({
    debug: this.debug(),
    pressed: this.pressed(),
    defaultPressed: this.defaultPressed(),
    onPressedChange: emitChange(this.beforePressedChange, this.pressedChange),
    value: this.value(),
    disabled: this.disabled(),
    focusableWhenDisabled: this.focusableWhenDisabled(),
    controller: this.controller(),
    group: this.#group ? () => this.#group?.handle.api : undefined,
    toolbar: this.#toolbar(),
  }))
  /** The toggle's state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * An icon inside a toggle. A toggle with only an icon needs an `aria-label`. Screen readers skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiToggleIcon]", exportAs: "uiToggleIcon" })
class ToggleIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  /** The part's state, as a signal. */
  readonly state = usePart(inject(Toggle).handle, "icon", () => ({
    mirror: this.mirror(),
  })).state
}

/**
 * Toggles that share one value, with one tab stop and arrow keys between them.
 * @experimental
 */
@Directive({ selector: "[uiToggleGroup]", exportAs: "uiToggleGroup" })
class ToggleGroup<Value extends string = string> {
  /** Logs every state change with its reason to the console, in development builds. */
  readonly debug = input(undefined, { transform: optionalBoolean })
  /** The pressed toggles' values. Bind it with `[(value)]` to control the group. */
  readonly value: InputSignal<ToggleGroupOptions<Value>["value"]> = input()
  /** The toggles pressed at first, when uncontrolled. */
  readonly defaultValue: InputSignal<
    ToggleGroupOptions<Value>["defaultValue"]
  > = input()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<ToggleGroupValueChange<Value>["value"]>()
  /** Runs when a toggle wants to be pressed or unpressed. `$event.reason` says why, and `$event.cancel()` stops it. */
  readonly beforeValueChange = output<ToggleGroupValueChange<Value>>()
  /** Whether several toggles can be pressed at once. Otherwise pressing one unpresses the others. */
  readonly multiple = input(undefined, { transform: optionalBoolean })
  /** Whether the pressed toggle can be unpressed when only one may be pressed. With `false`, one toggle stays pressed once any is. Ignored with `multiple`. */
  readonly deselectable = input(undefined, { transform: optionalBoolean })
  /** Stops every toggle from being pressed. They stay focusable with `aria-disabled`, so the group keeps its tab stop and stays discoverable. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** Which arrow keys move between toggles: left and right, or up and down. */
  readonly orientation: InputSignal<ToggleGroupOptions["orientation"]> = input()
  /** Whether arrow keys wrap from the last toggle to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Presses toggles from anywhere. Create one with `createToggleGroupController()`. */
  readonly controller: InputSignal<ToggleGroupOptions["controller"]> = input()
  readonly #toolbar = useToolbarScope()

  readonly handle = usePrimitive(toggleGroup, () => ({
    debug: this.debug(),
    value: this.value(),
    defaultValue: this.defaultValue(),
    onValueChange: emitTypedChange(this.beforeValueChange, this.valueChange),
    multiple: this.multiple(),
    deselectable: this.deselectable(),
    disabled: this.disabled(),
    orientation: this.orientation(),
    loop: this.loop(),
    controller: this.controller(),
    toolbar: this.#toolbar(),
  }))
  /** The toggle group's state, as a signal. */
  readonly state = usePart(this.handle, "group").state
}

export {
  createToggleController,
  createToggleGroupController,
} from "@ui-sdk/core/toggle"
export type {
  ToggleApi,
  ToggleChangeOptions,
  ToggleController,
  ToggleGroupApi,
  ToggleGroupChangeOptions,
  ToggleGroupController,
  ToggleGroupOptions,
  ToggleGroupOrientation,
  ToggleGroupPrimitive,
  ToggleGroupState,
  ToggleGroupValueChangeReason,
  ToggleIconProps,
  ToggleIconState,
  ToggleOptions,
  TogglePressedChangeReason,
  TogglePrimitive,
  ToggleState,
} from "@ui-sdk/core/toggle"

export {
  Toggle,
  ToggleGroup,
  type ToggleGroupValueChange,
  ToggleIcon,
  type TogglePressedChange,
}
