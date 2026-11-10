<!--
@component
When its event happened, as a `<time>`. Pass `datetime` so machines can
read it. It describes the event.
@experimental
-->
<script lang="ts">
  import { chronology, type ChronologyTimeState } from "@ui-sdk/core/chronology"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"
  import { useItem } from "./context"

  let props: PartProps<"time", ChronologyTimeState> = $props()

  const item = useItem()
  const time = usePart(chronology, "time", () => ({
    value: item.value(),
    status: item.status(),
  }))
</script>

<Part tag="time" part={time} {props} />
