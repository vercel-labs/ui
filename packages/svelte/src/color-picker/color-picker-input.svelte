<!--
@component
A text input that reads any CSS color on Enter or blur. Text that isn't one
goes back to the value. The core writes its text.
@experimental
-->
<script lang="ts">
  import { colorPicker, type ColorPickerState } from "@ui-sdk/core/color-picker"
  import { usePart } from "../instance"
  import Part from "../part.svelte"
  import type { TextPartProps } from "../text-control"

  let props: TextPartProps<"input", ColorPickerState> = $props()

  // Its own key, so each input of a picker binds and follows the value.
  const id = $props.id()
  const input = usePart(colorPicker, "input", () => ({ id }))
</script>

<Part tag="input" part={input} {props} />
