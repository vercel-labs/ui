<!--
@component
A cell of your own, like a status or a size.
@experimental
-->
<script lang="ts">
  import {
    waterfall,
    type WaterfallRowPartProps,
    type WaterfallRowState,
  } from "@ui-sdk/core/waterfall"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useRow } from "./context"

  let props: PartProps<"div", WaterfallRowState> & WaterfallRowPartProps =
    $props()

  const id = $props.id()
  const row = useRow()
  const part = usePart(waterfall, "cell", () => ({
    ...row.partProps(),
    id: props.id ?? id,
  }))
</script>

<Part tag="div" {part} {props} />
