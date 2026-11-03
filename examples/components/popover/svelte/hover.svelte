<script lang="ts">
  import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverClose,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
</script>

<Popover openOnHover delay={200} closeDelay={150}>
  <PopoverTrigger>@ada</PopoverTrigger>
  <PopoverContent sideOffset={10}>
    <PopoverArrow />
    <PopoverTitle>Ada Lovelace</PopoverTitle>
    <PopoverDescription>A collaborator on this project.</PopoverDescription>
    <PopoverClose>Close preview</PopoverClose>
  </PopoverContent>
</Popover>
