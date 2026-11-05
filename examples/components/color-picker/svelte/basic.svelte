<script lang="ts">
  import {
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
  } from "@ui-sdk/svelte/color-picker"
</script>

<ColorPicker aria-label="Brand color" defaultValue="#0ea5e9">
  <ColorPickerArea>
    <ColorPickerAreaThumb />
  </ColorPickerArea>
  <ColorPickerSlider channel="hue">
    <ColorPickerSliderThumb />
  </ColorPickerSlider>
  <div data-slot="row">
    <ColorPickerSwatch />
    <ColorPickerInput aria-label="Hex" />
  </div>
</ColorPicker>
