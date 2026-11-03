<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  let container: HTMLDivElement | undefined = $state()
</script>

<div data-slot="stack">
  <Popover>
    <PopoverTrigger>Open in the box</PopoverTrigger>
    <PopoverContent {container}>
      <PopoverTitle>Portaled</PopoverTitle>
      <PopoverDescription>This popover is in the box below, in the DOM.</PopoverDescription>
    </PopoverContent>
  </Popover>
  <div data-slot="card">
    Container
    <div bind:this={container}></div>
  </div>
</div>
