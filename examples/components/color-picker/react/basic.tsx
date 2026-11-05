"use client"

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
} from "@ui-sdk/react/color-picker"

function Example() {
  return (
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
  )
}

export { Example }
