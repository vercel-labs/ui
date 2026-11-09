<script lang="ts">
  import {
    select as selectPrimitive,
    type SelectTriggerProps,
    type SelectTriggerState,
  } from "@ui-sdk/core/select"
  import { useFieldControl } from "../field/context"
  import Part from "../part.svelte"
  import { provideInstance } from "../instance"
  import {
    useHandlePart,
    wrapPart,
    type PartProps,
  } from "../use-primitive.svelte"
  import type { SelectContext } from "./context"
  import SelectValue from "./select-value.svelte"

  // The bound part of a trigger, once its select is known. It follows `owner`, so
  // a trigger given another controller keeps its element and focus.
  let {
    owner,
    disabled,
    children,
    ...rest
  }: PartProps<"button", SelectTriggerState> &
    SelectTriggerProps & { owner: SelectContext } = $props()

  // A trigger outside the select brings the select to the value inside it.
  // Context is set once, so the handle it gets reads the current one.
  provideInstance(selectPrimitive, {
    get instance() {
      return owner.instance
    },
    get api() {
      return owner.api
    },
    get state() {
      return owner.state
    },
    controls: (key) => owner.controls(key),
  })
  const field = useFieldControl()
  const trigger = useHandlePart(
    () => owner,
    "trigger",
    () => ({ disabled, named: !!field || rest["aria-labelledby"] != null })
  )
  const control = field?.control(
    () => rest.id as string | undefined,
    () => rest["aria-describedby"]
  )
</script>

<!-- Without content, the trigger shows the value. -->
{#snippet value()}<SelectValue />{/snippet}

<Part
  tag="button"
  part={wrapPart(trigger, control)}
  props={{ ...rest, children: children ?? value }}
/>
