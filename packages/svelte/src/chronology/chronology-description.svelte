<!--
@component
More about its event. It describes the event.
@experimental
-->
<script lang="ts">
  import {
    chronology,
    type ChronologyDescriptionState,
  } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useItem } from "./context"

  let props: PartProps<"div", ChronologyDescriptionState> = $props()

  const item = useItem()
  const description = usePart(chronology, "description", () => ({
    value: item.value(),
    status: item.status(),
  }))
</script>

<Part tag="div" part={description} {props} />
