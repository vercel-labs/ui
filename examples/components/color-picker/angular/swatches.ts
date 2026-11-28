import { Component } from "@angular/core"
import { LucidePipette } from "@lucide/angular"
import {
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@ui-sdk/angular/color-picker"

@Component({
  imports: [
    ColorPicker,
    ColorPickerChannelInput,
    ColorPickerEyeDropper,
    ColorPickerSwatchItem,
    ColorPickerSwatches,
    LucidePipette,
  ],
  template: `
    <div
      uiColorPicker
      aria-label="Label color"
      space="srgb"
      format="hex"
      defaultValue="#0ea5e9"
    >
      <div uiColorPickerSwatches aria-label="Presets">
        @for (preset of presets; track preset) {
          <button uiColorPickerSwatchItem [value]="preset"></button>
        }
      </div>
      <div data-slot="row">
        <input uiColorPickerChannelInput channel="red" />
        <input uiColorPickerChannelInput channel="green" />
        <input uiColorPickerChannelInput channel="blue" />
        <button uiColorPickerEyeDropper aria-label="Pick from screen">
          <svg lucidePipette></svg>
        </button>
      </div>
    </div>
  `,
})
class Example {
  readonly presets = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#0ea5e9",
    "#6366f1",
    "#a855f7",
    "#ec4899",
  ]
}

export { Example }
