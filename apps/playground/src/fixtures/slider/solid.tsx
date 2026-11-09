import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/solid/slider"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import {
  serialize,
  sliderFixture as f,
  sliderOptions,
} from "tests/fixtures/slider.ts"

function Fixture() {
  const options = sliderOptions()
  const [action, setAction] = createSignal("")
  const [commits, setCommits] = createSignal<string[]>([])
  const [submitted, setSubmitted] = createSignal("")
  const [volume, setVolume] = createSignal(options.volume)
  // Records a change, or cancels it when the URL asks.
  const report = (
    name: string,
    value: number | number[],
    details: { cancel: () => void }
  ) => {
    if (options.cancel === name) {
      return details.cancel()
    }
    setAction(`${name}:${String(value)}`)
  }
  const commit = (name: string) => (value: number | number[]) =>
    setCommits((list) => [...list, `${name}:${String(value)}`])
  const shared = {
    orientation: options.orientation,
    disabled: options.disabled,
    largeStep: options.largeStep,
    locale: options.locale,
  }

  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serialize(event.currentTarget))
        }}
      >
        <Field>
          <FieldLabel>{f.volume.label}</FieldLabel>
          <Slider
            {...shared}
            name={f.volume.name}
            format={options.volumeFormat}
            value={options.controlled ? volume() : undefined}
            defaultValue={options.controlled ? undefined : options.volume}
            onValueChange={(value, details) => {
              report(f.volume.name, value, details)
              if (!details.canceled) {
                setVolume(value)
              }
            }}
            onValueCommit={commit(f.volume.name)}
          >
            <SliderValue class="slider-value" />
            <SliderControl class="slider-control">
              <SliderTrack class="slider-track">
                <SliderIndicator class="slider-indicator" />
                <SliderThumb class="slider-thumb" />
              </SliderTrack>
            </SliderControl>
          </Slider>
          <FieldDescription>{f.volume.description}</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>{f.price.label}</FieldLabel>
          <Slider
            {...shared}
            name={f.price.name}
            defaultValue={options.price}
            minStepsBetweenThumbs={options.minSteps}
            format={options.format}
            onValueChange={(value, details) =>
              report(f.price.name, value, details)
            }
            onValueCommit={commit(f.price.name)}
          >
            <SliderValue class="slider-value" />
            <SliderControl class="slider-control">
              <SliderTrack class="slider-track">
                <SliderIndicator class="slider-indicator" />
                <For each={f.price.thumbs}>
                  {(label, index) => (
                    <SliderThumb
                      index={index()}
                      class="slider-thumb"
                      aria-label={label}
                    />
                  )}
                </For>
              </SliderTrack>
            </SliderControl>
          </Slider>
        </Field>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Committed">
        {commits().join(" ")}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
