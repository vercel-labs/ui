<script lang="ts">
  import { SettingsIcon } from "@lucide/svelte"
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  let anchor: HTMLInputElement | undefined = $state()
</script>

<div data-slot="row">
  <input bind:this={anchor} placeholder="Search" aria-label="Search" />
  <Popover>
    <PopoverTrigger aria-label="Search filters">
      <SettingsIcon aria-hidden="true" />
    </PopoverTrigger>
    <PopoverContent {anchor} align="start" sideOffset={8}>
      <PopoverTitle>Filters</PopoverTitle>
      <PopoverDescription>The popover lines up with the search field.</PopoverDescription>
    </PopoverContent>
  </Popover>
</div>
