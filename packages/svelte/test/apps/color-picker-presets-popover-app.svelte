<script lang="ts">
  import {
    ColorPicker,
    ColorPickerSwatchItem,
    ColorPickerSwatches,
  } from "../../src/color-picker"
  import { Popover, PopoverContent, PopoverTrigger } from "../../src/popover"

  let { value }: { value: string } = $props()

  const presets = ["#DC2626", "#EA580C", "#7C3AED", "#64748B"]
</script>

<ColorPicker aria-label="Design color" defaultValue={value}>
  <Popover>
    <PopoverTrigger>Recolor</PopoverTrigger>
    <PopoverContent aria-label="Recolor">
      <ColorPickerSwatches aria-label="Presets">
        {#each presets as preset (preset)}
          <ColorPickerSwatchItem value={preset} />
        {/each}
      </ColorPickerSwatches>
    </PopoverContent>
  </Popover>
</ColorPicker>
