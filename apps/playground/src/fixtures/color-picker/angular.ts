import { Component } from "@angular/core"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaCanvas,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerEyeDropper,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
  createColorPickerController,
  type ColorPickerValueChange,
  type ColorPickerValueCommit,
} from "@ui-sdk/angular/color-picker"
import { colorPickerFixture } from "../../../../../tests/fixtures/color-picker"
import { colorPickerOptions } from "../../../../../tests/fixtures/page"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaCanvas,
    ColorPickerAreaThumb,
    ColorPickerChannelInput,
    ColorPickerEyeDropper,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    ColorPickerSwatchItem,
    ColorPickerSwatches,
  ],
  template: `
    <form class="fixture" (submit)="onSubmit($event)">
      <button type="button">Before</button>
      <div
        uiColorPicker
        [attr.aria-label]="f.label"
        [name]="f.name"
        [controller]="controller"
        [defaultValue]="options.defaultValue"
        [disabled]="options.disabled"
        [readOnly]="options.readOnly"
        [space]="options.space"
        [format]="options.format"
        [gamut]="options.gamut"
        (beforeValueChange)="onValueChange($event)"
        (valueCommit)="onValueCommit($event)"
      >
        <div uiColorPickerArea>
          @if (options.space === "oklch") {
            <canvas uiColorPickerAreaCanvas></canvas>
          }
          <div uiColorPickerAreaThumb></div>
        </div>
        <div uiColorPickerSlider channel="hue">
          <div uiColorPickerSliderThumb></div>
        </div>
        <div uiColorPickerSlider channel="alpha">
          <div uiColorPickerSliderThumb></div>
        </div>
        <input uiColorPickerInput [attr.aria-label]="f.inputLabel" />
        <input uiColorPickerChannelInput channel="alpha" />
        <div uiColorPickerSwatch></div>
        <button uiColorPickerEyeDropper>Pick from screen</button>
        <div uiColorPickerSwatches aria-label="Presets">
          @for (swatch of f.swatches; track swatch) {
            <button uiColorPickerSwatchItem [value]="swatch"></button>
          }
        </div>
      </div>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" (click)="controller.setValue('rebeccapurple')">
        Use purple
      </button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output aria-label="Committed">{{ committed() }}</output>
      <output aria-label="Submitted">{{ submitted() }}</output>
    </form>
  `,
})
class Fixture {
  readonly f = colorPickerFixture
  readonly controller = createColorPickerController()
  readonly options: ReturnType<typeof colorPickerOptions> & {
    space?: "hsv" | "hsl" | "srgb" | "oklch"
    format?: "hex"
    gamut?: false | "srgb" | "p3"
  } = colorPickerOptions()
  readonly action = state("")
  readonly committed = state("")
  readonly submitted = state("")

  onValueChange(change: ColorPickerValueChange) {
    if (this.options.cancel) {
      return change.cancel()
    }
    this.action.set(`${change.value}:${change.reason}`)
  }

  onValueCommit(change: ColorPickerValueCommit) {
    this.committed.set(`${change.value}:${change.reason}`)
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(
      Array.from(
        new FormData(event.currentTarget as HTMLFormElement),
        ([key, value]) => `${key}=${value}`
      ).join("&")
    )
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
