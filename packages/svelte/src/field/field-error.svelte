<!--
@component
Shows while the field shows as invalid. Without content, it shows the
browser's message for the current problem.
@stable
-->
<script lang="ts">
  import type { FieldErrorProps, FieldErrorState } from "@ui-sdk/core/field"
  import { fieldOutsideErrorShown } from "@ui-sdk/core/renderer"
  import Part from "../part.svelte"
  import { useHandlePart, type PartProps } from "../use-primitive.svelte"
  import { outsidePart, useField } from "./context"

  let { match, children, ...rest }: PartProps<"div", FieldErrorState> & FieldErrorProps = $props()

  const field = useField()
  const uid = $props.id()
  // Only an error with `match` needs an id of its own. One without takes the
  // field's, which the control points at before the field binds.
  const error = field
    ? useHandlePart(field, "error", () => ({
        id: rest.id ?? (match === undefined ? undefined : `ui-sdk-${uid}`),
        match,
      }))
    : undefined
  const shown = $derived(error ? error.present : fieldOutsideErrorShown({ match }))
  const part = error ?? outsidePart("error")
</script>

{#snippet message(state: FieldErrorState)}{state.message}{/snippet}

{#if shown}
  <Part tag="div" {part} props={{ ...rest, children: children ?? message }} />
{/if}
