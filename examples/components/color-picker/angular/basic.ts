import { Component, signal } from "@angular/core"
import { LucidePipette } from "@lucide/angular"
import {
  formatColor,
  parseColor,
  type ColorFormat,
} from "@ui-sdk/angular/color"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "@ui-sdk/angular/color-picker"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerEyeDropper,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    ColorPickerSwatchItem,
    ColorPickerSwatches,
    LucidePipette,
  ],
  template: `
    <div
      uiColorPicker
      [(value)]="value"
      aria-label="Brand color"
      [format]="format()"
    >
      <div uiColorPickerArea>
        <div uiColorPickerAreaThumb></div>
      </div>
      <div data-slot="row">
        <button uiColorPickerEyeDropper aria-label="Pick from screen">
          <svg lucidePipette></svg>
        </button>
        <div data-slot="color-picker-sliders">
          <div uiColorPickerSlider channel="hue">
            <div uiColorPickerSliderThumb></div>
          </div>
          <div uiColorPickerSlider channel="alpha">
            <div uiColorPickerSliderThumb></div>
          </div>
        </div>
        <div uiColorPickerSwatch></div>
      </div>
      <div data-slot="row">
        <select
          aria-label="Format"
          [value]="format()"
          #field
          (change)="changeFormat(field.value)"
        >
          @for (option of formats; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
        <input uiColorPickerInput aria-label="Color" />
      </div>
      <div uiColorPickerSwatches aria-label="Presets">
        @for (preset of presets; track preset) {
          <button uiColorPickerSwatchItem [value]="preset"></button>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly formats: { label: string; value: ColorFormat }[] = [
    { label: "Hex", value: "hex" },
    { label: "RGB", value: "srgb" },
    { label: "HSL", value: "hsl" },
    { label: "OKLCH", value: "oklch" },
  ]

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

  readonly format = signal<ColorFormat>("hex")

  readonly value = signal("#0ea5e9")

  changeFormat(value: string) {
    const next = value as ColorFormat
    this.format.set(next)
    this.value.set(formatColor(parseColor(this.value())!, next))
  }
}

export { Example }
