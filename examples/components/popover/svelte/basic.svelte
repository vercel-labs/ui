<script lang="ts">
  import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const dimensions = [
    { label: "Width", value: "100%" },
    { label: "Max. width", value: "300px" },
    { label: "Height", value: "25px" },
    { label: "Max. height", value: "none" },
  ]
</script>

<Popover>
  <PopoverTrigger>Open popover</PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Dimensions</PopoverTitle>
    <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
    <div data-slot="stack">
      {#each dimensions as dimension (dimension.label)}
        <label data-slot="label">
          {dimension.label}
          <input value={dimension.value} />
        </label>
      {/each}
    </div>
  </PopoverContent>
</Popover>
