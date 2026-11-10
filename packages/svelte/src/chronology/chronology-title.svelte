<!--
@component
What happened. It names its event.
@experimental
-->
<script lang="ts">
  import {
    chronology,
    type ChronologyTitleState,
  } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useItem } from "./context"

  let props: PartProps<"div", ChronologyTitleState> = $props()

  const item = useItem()
  const title = usePart(chronology, "title", () => ({
    value: item.value(),
    status: item.status(),
  }))
</script>

<Part tag="div" part={title} {props} />
