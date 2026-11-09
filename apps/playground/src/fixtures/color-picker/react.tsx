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
} from "@ui-sdk/react/color-picker"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { colorPickerOptions } from "tests/fixtures/page.ts"
import { colorPickerFixture } from "tests/fixtures/color-picker.ts"

const controller = createColorPickerController()

const entries = (form: HTMLFormElement) =>
  Array.from(new FormData(form), ([key, value]) => `${key}=${value}`).join("&")

function Fixture() {
  const [action, setAction] = React.useState("")
  const [committed, setCommitted] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const { cancel, ...options } = colorPickerOptions()
  return (
    <form
      className="fixture"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(entries(event.currentTarget))
      }}
    >
      <button type="button">Before</button>
      <ColorPicker
        aria-label={colorPickerFixture.label}
        name={colorPickerFixture.name}
        controller={controller}
        {...options}
        onValueChange={(value, details) => {
          if (cancel) {
            return details.cancel()
          }
          setAction(`${value}:${details.reason}`)
        }}
        onValueCommit={(value, details) =>
          setCommitted(`${value}:${details.reason}`)
        }
      >
        <ColorPickerArea>
          {options.space === "oklch" && <ColorPickerAreaCanvas />}
          <ColorPickerAreaThumb />
        </ColorPickerArea>
        <ColorPickerSlider channel="hue">
          <ColorPickerSliderThumb />
        </ColorPickerSlider>
        <ColorPickerSlider channel="alpha">
          <ColorPickerSliderThumb />
        </ColorPickerSlider>
        <ColorPickerInput aria-label={colorPickerFixture.inputLabel} />
        <ColorPickerChannelInput channel="alpha" />
        <ColorPickerSwatch />
        <ColorPickerEyeDropper>Pick from screen</ColorPickerEyeDropper>
        <ColorPickerSwatches aria-label="Presets">
          {colorPickerFixture.swatches.map((swatch) => (
            <ColorPickerSwatchItem key={swatch} value={swatch} />
          ))}
        </ColorPickerSwatches>
      </ColorPicker>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button
        type="button"
        onClick={() => controller.setValue("rebeccapurple")}
      >
        Use purple
      </button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Committed">{committed}</output>
      <output aria-label="Submitted">{submitted}</output>
    </form>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
