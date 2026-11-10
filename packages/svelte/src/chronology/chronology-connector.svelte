<!--
@component
The line between its event's marker and the next one. Hidden from
assistive technology.
@experimental
-->
<script lang="ts">
  import {
    chronology,
    type ChronologyConnectorState,
  } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useItem } from "./context"

  let props: PartProps<"div", ChronologyConnectorState> = $props()

  const item = useItem()
  const connector = usePart(chronology, "connector", () => ({
    value: item.value(),
    status: item.status(),
  }))
</script>

<Part tag="div" part={connector} {props} />
