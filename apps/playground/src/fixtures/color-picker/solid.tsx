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
} from "@ui-sdk/solid/color-picker"
import { render } from "@solidjs/web"
import { createSignal, For, Show } from "solid-js"
import { colorPickerOptions } from "tests/fixtures/page.ts"
import { colorPickerFixture } from "tests/fixtures/color-picker.ts"

const controller = createColorPickerController()

const entries = (form: HTMLFormElement) =>
  Array.from(new FormData(form), ([key, value]) => `${key}=${value}`).join("&")

function Fixture() {
  const [action, setAction] = createSignal("")
  const [committed, setCommitted] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const { cancel, ...options } = colorPickerOptions()
  return (
    <form
      class="fixture"
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
          <Show when={options.space === "oklch"}>
            <ColorPickerAreaCanvas />
          </Show>
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
          <For each={colorPickerFixture.swatches}>
            {(swatch) => <ColorPickerSwatchItem value={swatch} />}
          </For>
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
        {action()}
      </output>
      <output aria-label="Committed">{committed()}</output>
      <output aria-label="Submitted">{submitted()}</output>
    </form>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
