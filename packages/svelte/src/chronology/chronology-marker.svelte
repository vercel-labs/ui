<!--
@component
The dot or icon that marks its event on the line. Hidden from assistive
technology.
@experimental
-->
<script lang="ts">
  import {
    chronology,
    type ChronologyMarkerState,
  } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useItem } from "./context"

  let props: PartProps<"div", ChronologyMarkerState> = $props()

  const item = useItem()
  const marker = usePart(chronology, "marker", () => ({
    value: item.value(),
    status: item.status(),
  }))
</script>

<Part tag="div" part={marker} {props} />
