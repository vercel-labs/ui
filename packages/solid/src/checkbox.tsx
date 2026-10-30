import {
  checkbox,
  checkboxGroup as checkboxGroupPrimitive,
  type CheckboxGroupOptions,
  type CheckboxGroupState,
  type CheckboxOptions,
  type CheckboxState,
} from "@ui-sdk/core/checkbox"
import { omit } from "solid-js"
import { joinField, useFieldControl, type ButtonControlProps } from "./field-context"
import { createParts, useNearest, usePart, usePrimitive, type PartProps } from "./use-primitive"

const parts = createParts(checkbox, { indicator: "span" })
const groupParts = createParts(checkboxGroupPrimitive, {})

/**
 * The control and the hidden native input that takes part in the form.
 * @stable
 */
function Checkbox(props: Omit<CheckboxOptions, "group"> & ButtonControlProps<CheckboxState>) {
  const group = useNearest(checkboxGroupPrimitive)
  // Inside a group, the group is the field's control.
  const field = useFieldControl()
  const fieldControl = group ? null : field
  // Made once. A new function on each options run hands the options over again
  // in the group's own update, and the parent checkbox then shows stale state.
  const groupApi = group ? () => group.api : undefined
  const handle = usePrimitive(checkbox, () => ({
    checked: props.checked,
    defaultChecked: props.defaultChecked,
    onCheckedChange: props.onCheckedChange,
    disabled: props.disabled || fieldControl?.disabled(),
    readOnly: props.readOnly,
    required: props.required,
    name: props.name ?? fieldControl?.name(),
    value: props.value,
    form: props.form,
    parent: props.parent,
    group: groupApi,
    controller: props.controller,
    debug: props.debug,
  }))
  const rest = omit(
    props,
    "checked",
    "defaultChecked",
    "onCheckedChange",
    "disabled",
    "readOnly",
    "required",
    "name",
    "value",
    "form",
    "parent",
    "controller",
    "debug",
  )
  const input = handle.slot("input")
  return (
    <>
      {usePart(handle, "root", undefined, joinField(fieldControl, rest, "button"), "button")}
      <input {...input} />
    </>
  )
}

/**
 * The check inside the checkbox. Rendered while it's checked or indeterminate, or always with `keepMounted`.
 * @stable
 */
const CheckboxIndicator = parts.Indicator

/**
 * Checkboxes that share a name and a list of checked values. The group, not
 * each checkbox, sits in a field.
 * `T` is inferred from `value`, `defaultValue` or `onValueChange`.
 * @stable
 */
function CheckboxGroup<T extends string = string>(
  props: CheckboxGroupOptions<T> & Omit<PartProps<"div", CheckboxGroupState>, "onChange" | "onSelect">,
) {
  const field = useFieldControl()
  const rest = omit(
    props,
    "value",
    "defaultValue",
    "onValueChange",
    "allValues",
    "disabled",
    "required",
    "name",
    "form",
    "controller",
    "debug",
  )
  // The group's element joins the field it's in, which also names and disables it.
  return (
    <groupParts.Root<T>
      {...props}
      disabled={props.disabled || field?.disabled()}
      name={props.name ?? field?.name()}
    >
      {usePart(checkboxGroupPrimitive, "group", undefined, joinField(field, rest, "div"), "div")}
      {usePart(checkboxGroupPrimitive, "group-input", undefined, {}, "input")}
    </groupParts.Root>
  )
}

export { createCheckboxController, createCheckboxGroupController } from "@ui-sdk/core/checkbox"
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

export { Checkbox, CheckboxGroup, CheckboxIndicator }
