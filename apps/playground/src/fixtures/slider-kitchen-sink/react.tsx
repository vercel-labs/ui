import {
  createSliderController,
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@ui-sdk/react/slider"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { classes as c } from "./classes"
import { renderShell, type Log } from "./shell"
import {
  describe,
  formats,
  thumbLabel,
  thumbsOf,
  type Variant,
} from "./variants"

function Control({ variant, log }: { variant: Variant; log: Log }) {
  const options = (variant.options ?? {}) as Record<string, any>
  const [value, setValue] = React.useState<number | number[]>(
    options.defaultValue ?? 0
  )
  const [controller] = React.useState(() => createSliderController())
  const { defaultValue, ...rest } = options
  return (
    <>
      <Slider
        className={c.root}
        {...rest}
        {...(variant.controlled ? { value } : { defaultValue })}
        format={variant.format && formats[variant.format]}
        form={variant.place === "outside" ? variant.id : undefined}
        controller={variant.controller ? controller : undefined}
        onValueChange={(next, details) => {
          setValue(next)
          log.change(
            `${describe(next)} (${details.reason}, thumb ${details.thumb})`
          )
        }}
        onValueCommit={(next, details) =>
          log.commit(`${describe(next)} (${details.reason})`)
        }
      >
        {variant.custom ? (
          <SliderValue className={c.value}>
            {(state) => `Between ${state.text}`}
          </SliderValue>
        ) : (
          <SliderValue className={c.value} />
        )}
        <SliderControl className={c.control}>
          <SliderTrack className={c.track}>
            <SliderIndicator className={c.indicator} />
            {Array.from({ length: thumbsOf(variant) }, (_, index) => (
              <SliderThumb
                key={index}
                index={index}
                className={c.thumb}
                aria-label={thumbLabel(variant, index)}
              >
                {variant.custom &&
                  ((state) => (
                    <span className={c.bubble}>{state.thumbValue}</span>
                  ))}
              </SliderThumb>
            ))}
          </SliderTrack>
        </SliderControl>
      </Slider>
      {variant.controlled && (
        <span className={c.description}>value: {describe(value)}</span>
      )}
      {variant.presets && (
        <div className={c.row}>
          {variant.presets.map((preset) => (
            <button
              key={describe(preset)}
              type="button"
              className={c.button}
              onClick={() =>
                variant.controller
                  ? controller.setValue(preset)
                  : setValue(preset)
              }
            >
              Set {describe(preset)}
            </button>
          ))}
          {variant.controller && (
            <button
              type="button"
              className={c.button}
              onClick={() => controller.focus(thumbsOf(variant) - 1)}
            >
              Focus last thumb
            </button>
          )}
        </div>
      )}
    </>
  )
}

function Card({ variant, log }: { variant: Variant; log: Log }) {
  const control = <Control variant={variant} log={log} />
  let body: React.ReactNode = control
  if (variant.place === "field") {
    body = (
      <Field className={c.form} name="level">
        <FieldLabel className={c.label}>Level</FieldLabel>
        {control}
        <FieldDescription className={c.description}>
          Where the level sits.
        </FieldDescription>
      </Field>
    )
  }
  if (variant.place === "fieldset") {
    body = <fieldset disabled>{body}</fieldset>
  }
  if (variant.place === "rtl") {
    body = <div dir="rtl">{body}</div>
  }
  if (variant.place === "transformed") {
    body = <div className={c.transformed}>{body}</div>
  }
  const buttons = (
    <div className={c.row}>
      <button className={c.button}>Save</button>
      <button type="reset" className={c.button}>
        Reset
      </button>
    </div>
  )
  if (variant.place === "outside") {
    return (
      <>
        <form id={variant.id} className={c.form}>
          {buttons}
        </form>
        {body}
      </>
    )
  }
  return (
    <form id={variant.id} className={c.form}>
      {body}
      {buttons}
    </form>
  )
}

function mount(root: HTMLElement) {
  renderShell(root, "react", (slot, variant, log) =>
    createRoot(slot).render(
      <React.StrictMode>
        <Card variant={variant} log={log} />
      </React.StrictMode>
    )
  )
}

export { mount }
