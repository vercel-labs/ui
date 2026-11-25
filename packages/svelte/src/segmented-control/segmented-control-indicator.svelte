<!--
@component
Sits behind the checked item. Its box comes from the
`--segmented-control-indicator-*` variables, measured from the root.
@experimental
-->
<script lang="ts">
  import {
    segmentedControl,
    type SegmentedControlIndicatorProps,
    type SegmentedControlIndicatorState,
  } from "@ui-sdk/core/segmented-control"
  import { usePart } from "../instance"
  import Part from "../part.svelte"
  import type { PartProps } from "../use-primitive.svelte"

  let {
    followHover,
    ...rest
  }: PartProps<"span", SegmentedControlIndicatorState> &
    SegmentedControlIndicatorProps = $props()

  const indicator = usePart(segmentedControl, "indicator", () => ({
    followHover,
  }))
</script>

<Part tag="span" part={indicator} props={rest} />
