import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  serialize,
  sliderFixture as f,
  sliderOptions,
} from "tests/fixtures/slider.ts"

function Fixture() {
  const options = sliderOptions()
  const [action, setAction] = React.useState("")
  const [commits, setCommits] = React.useState<string[]>([])
  const [submitted, setSubmitted] = React.useState("")
  const [volume, setVolume] = React.useState(options.volume)
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
    <div className="fixture">
      <button>Before</button>
      <form
        className="form"
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
            {...(options.controlled
              ? { value: volume }
              : { defaultValue: options.volume })}
            onValueChange={(value, details) => {
              report(f.volume.name, value, details)
              if (!details.canceled) {
                setVolume(value)
              }
            }}
            onValueCommit={commit(f.volume.name)}
          >
            <SliderValue className="slider-value" />
            <SliderControl className="slider-control">
              <SliderTrack className="slider-track">
                <SliderIndicator className="slider-indicator" />
                <SliderThumb className="slider-thumb" />
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
            <SliderValue className="slider-value" />
            <SliderControl className="slider-control">
              <SliderTrack className="slider-track">
                <SliderIndicator className="slider-indicator" />
                {f.price.thumbs.map((label, index) => (
                  <SliderThumb
                    key={label}
                    index={index}
                    className="slider-thumb"
                    aria-label={label}
                  />
                ))}
              </SliderTrack>
            </SliderControl>
          </Slider>
        </Field>

        <div className="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Committed">
        {commits.join(" ")}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
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
