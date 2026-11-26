import {
  checkbox,
  checkboxGroup,
  type CheckboxGroupController,
  type CheckboxGroupOptions,
  type CheckboxGroupState,
  type CheckboxOptions,
  type CheckboxState,
} from "@ui-sdk/core/checkbox"
import * as React from "react"
import {
  controlRender,
  FieldContext,
  type FieldContextValue,
  useJoinField,
  type ButtonControlProps,
} from "./field-context"
import {
  createParts,
  reading,
  usePart,
  usePrimitive,
  type PartProps,
  type PrimitiveHandle,
} from "./use-primitive"

const parts = createParts(checkbox, { root: "button", indicator: "span" })

// The group's own context, so a checkbox can join a group without bundling it.
const CheckboxGroupContext = React.createContext<PrimitiveHandle<
  typeof checkboxGroup
> | null>(null)

// The field the group joined, so a checkbox joins only a field of its own.
const GroupFieldContext = React.createContext<FieldContextValue | null>(null)

// The hidden native inputs that take part in the form.
function CheckboxInput() {
  return usePart(checkbox, "input", {}, {}, "input")
}

function GroupInput() {
  return usePart(checkboxGroup, "group-input", {}, {}, "input")
}

/**
 * The control and the hidden native input that takes part in the form.
 * @stable
 */
function Checkbox({
  disabled,
  name,
  render,
  ...props
}: Omit<CheckboxOptions, "group"> & ButtonControlProps<CheckboxState>) {
  const group = React.useContext(CheckboxGroupContext)
  // A checkbox in a field of its own is that field's control. In the group's field, the group is.
  const nearest = React.useContext(FieldContext)
  const groupField = React.useContext(GroupFieldContext)
  const fieldControl = useJoinField(
    group && nearest === groupField ? null : nearest
  )
  return (
    <parts.Root
      {...props}
      disabled={disabled || fieldControl?.disabled}
      name={name ?? fieldControl?.name}
      group={group ? reading(group, () => group.api) : undefined}
      render={controlRender(fieldControl, "button", render, <CheckboxInput />)}
    />
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
function CheckboxGroup<T extends string = string>({
  value,
  defaultValue,
  onValueChange,
  allValues,
  readOnly,
  disabled,
  required,
  name,
  form,
  controller,
  debug,
  render,
  ...props
}: CheckboxGroupOptions<T> &
  Omit<
    PartProps<"div", CheckboxGroupState>,
    "defaultValue" | "onChange" | "onSelect"
  >) {
  const groupField = React.useContext(FieldContext)
  const field = useJoinField(groupField)
  const group = usePrimitive(checkboxGroup, {
    value,
    defaultValue,
    onValueChange: onValueChange as CheckboxGroupOptions["onValueChange"],
    allValues,
    disabled: disabled || field?.disabled,
    readOnly,
    required,
    name: name ?? field?.name,
    form,
    controller: controller as CheckboxGroupController | undefined,
    debug,
  })
  return (
    <CheckboxGroupContext value={group}>
      <GroupFieldContext value={groupField}>
        {usePart(
          group,
          "group",
          {},
          {
            ...props,
            render: controlRender(field, "div", render, <GroupInput />),
          },
          "div"
        )}
      </GroupFieldContext>
    </CheckboxGroupContext>
  )
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

export { Checkbox, CheckboxGroup, CheckboxIndicator }
