<!--
@component
Marks the selected tab. Its box comes from the `--active-tab-*` variables, measured from the tab list.
@stable
-->
<script lang="ts">
  import {
    tabs,
    type TabsIndicatorProps,
    type TabsIndicatorState,
  } from "@ui-sdk/core/tabs"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"

  let {
    followHover,
    ...rest
  }: PartProps<"span", TabsIndicatorState> & TabsIndicatorProps = $props()

  const indicator = usePart(tabs, "indicator", () => ({ followHover }))
</script>

<Part tag="span" part={indicator} props={rest} />
