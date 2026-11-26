import type { checkbox, checkboxGroup } from "@ui-sdk/core/checkbox"
import { getContext } from "svelte"
import type { PrimitiveHandle } from "../use-primitive.svelte"

type CheckboxContext = PrimitiveHandle<typeof checkbox>
type CheckboxGroupContext = PrimitiveHandle<typeof checkboxGroup>

const CheckboxKey = Symbol("checkbox")
const CheckboxGroupKey = Symbol("checkbox-group")
// The field the group joined, so a checkbox joins only a field of its own.
const GroupFieldKey = Symbol("checkbox-group-field")

/** The group a checkbox belongs to, if any. */
function useCheckboxGroup() {
  return getContext<CheckboxGroupContext | undefined>(CheckboxGroupKey) ?? null
}

export {
  type CheckboxContext,
  type CheckboxGroupContext,
  CheckboxGroupKey,
  CheckboxKey,
  GroupFieldKey,
  useCheckboxGroup,
}
