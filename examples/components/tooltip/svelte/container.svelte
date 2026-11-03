<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/svelte/tooltip"

  let container: HTMLDivElement | undefined = $state()
</script>

<div data-slot="stack">
  <Tooltip {container}>
    <TooltipTrigger>Show in the box</TooltipTrigger>
    <TooltipContent>This tooltip is in the box below, in the DOM.</TooltipContent>
  </Tooltip>
  <div data-slot="card">
    Container
    <div bind:this={container}></div>
  </div>
</div>
