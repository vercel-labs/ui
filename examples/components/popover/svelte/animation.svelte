<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  let status = $state("Closed")
</script>

<Popover
  onOpenChange={(open) => (status = open ? "Opening" : "Closing")}
  onOpenChangeComplete={(open) => (status = open ? "Open" : "Closed")}
>
  <PopoverTrigger>Animated</PopoverTrigger>
  <PopoverContent keepMounted>
    <PopoverTitle>Scale and fade</PopoverTitle>
    <PopoverDescription>300ms in and out, from the trigger.</PopoverDescription>
  </PopoverContent>
</Popover>
<output data-slot="output">{status}</output>
