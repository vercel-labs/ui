// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerInput,
  ColorPickerSlider,
  ColorPickerSliderThumb,
  ColorPickerSwatch,
  ColorPickerSwatches,
  ColorPickerSwatchItem,
} from "../src/color-picker"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [
    ColorPicker,
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerChannelInput,
    ColorPickerInput,
    ColorPickerSlider,
    ColorPickerSliderThumb,
    ColorPickerSwatch,
    ColorPickerSwatches,
    ColorPickerSwatchItem,
  ],
  template: `
    <form id="form">
      <div uiColorPicker id="picker" name="accent" [(value)]="value">
        <div uiColorPickerArea x="saturation" y="brightness">
          <div uiColorPickerAreaThumb id="area-thumb"></div>
        </div>
        <div uiColorPickerSlider channel="hue">
          <div uiColorPickerSliderThumb id="hue"></div>
        </div>
        <div uiColorPickerSwatch id="swatch"></div>
        <input uiColorPickerInput id="input" aria-label="Color" />
        <input uiColorPickerChannelInput id="channel" channel="hue" />
        <div uiColorPickerSwatches>
          <button uiColorPickerSwatchItem id="blue" value="#0000ff"></button>
        </div>
      </div>
    </form>
  `,
})
class Parts {
  readonly value = signal("#ff0000")
}

const byId = (id: string) => document.getElementById(id)!

describe("color picker", () => {
  test("its parts show the color and a swatch sets it", async () => {
    const { instance, settle } = await mount(Parts)
    expect(byId("picker").getAttribute("role")).toBe("group")
    expect(byId("hue").getAttribute("role")).toBe("slider")
    expect(byId("hue").getAttribute("aria-valuenow")).toBe("0")
    expect(byId("area-thumb").getAttribute("role")).toBe("slider")
    expect((byId("input") as HTMLInputElement).value).toBe("#ff0000")
    expect((byId("channel") as HTMLInputElement).value).toBe("0")
    const form = () => new FormData(byId("form") as HTMLFormElement)
    expect(form().get("accent")).toBe("#ff0000")

    byId("blue").click()
    await settle()
    expect(instance.value()).toBe("#0000ff")
    expect(byId("hue").getAttribute("aria-valuenow")).toBe("240")
    expect((byId("channel") as HTMLInputElement).value).toBe("240")
    expect(form().get("accent")).toBe("#0000ff")
  })

  test("arrow keys on a slider's thumb change its channel", async () => {
    const { instance, settle } = await mount(Parts)
    byId("hue").dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    )
    await settle()
    expect(byId("hue").getAttribute("aria-valuenow")).toBe("1")
    expect(instance.value()).not.toBe("#ff0000")
  })
})
