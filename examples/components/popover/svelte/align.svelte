<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const aligns = ["start", "center", "end"] as const
</script>

<div data-slot="row">
  {#each aligns as align (align)}
    <Popover>
      <PopoverTrigger>Align {align}</PopoverTrigger>
      <PopoverContent {align}>
        <PopoverTitle>Aligned to the {align}</PopoverTitle>
        <PopoverDescription>The popover lines up with the trigger's {align}.</PopoverDescription>
      </PopoverContent>
    </Popover>
  {/each}
</div>
