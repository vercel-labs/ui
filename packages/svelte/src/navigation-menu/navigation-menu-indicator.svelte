<!--
@component
Sits under the open trigger, or under the link with `current` while every panel is closed. Screen readers
skip it.
@stable
-->
<script lang="ts">
  import {
    navigationMenu,
    type NavigationMenuIndicatorProps,
    type NavigationMenuIndicatorState,
  } from "@ui-sdk/core/navigation-menu"
  import Part from "../part.svelte"
  import { usePart } from "../instance"
  import type { PartProps } from "../use-primitive.svelte"

  let {
    followHover,
    ...rest
  }: PartProps<"div", NavigationMenuIndicatorState> &
    NavigationMenuIndicatorProps = $props()

  const indicator = usePart(navigationMenu, "indicator", () => ({
    followHover,
  }))
</script>

<Part tag="div" part={indicator} props={rest} />
