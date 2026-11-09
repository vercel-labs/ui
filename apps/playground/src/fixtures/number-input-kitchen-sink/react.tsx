import {
  createNumberInputController,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/react/number-input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { classes as c } from "./classes"
import { renderShell, type Log } from "./shell"
import { describe, formats, type Variant } from "./variants"

function Control({ variant, log }: { variant: Variant; log: Log }) {
  const options = (variant.options ?? {}) as Record<string, any>
  const [value, setValue] = React.useState<number | null>(
    options.defaultValue ?? null
  )
  const [controller] = React.useState(() => createNumberInputController())
  const { defaultValue, ...rest } = options
  const field = variant.place === "field"
  const scrubArea = variant.scrub && (
    <NumberInputScrubArea
      className={c.scrub}
      orientation={variant.scrub.orientation}
      pixelsPerStep={variant.scrub.pixelsPerStep}
      controller={variant.scrub.outside ? controller : undefined}
    >
      {variant.scrub.orientation === "vertical" ? "↕ Drag" : "↔ Drag"}
      <NumberInputScrubAreaCursor className={c.cursor}>
        {variant.scrub.orientation === "vertical" ? "↕" : "↔"}
      </NumberInputScrubAreaCursor>
    </NumberInputScrubArea>
  )
  return (
    <>
      {variant.scrub?.outside && scrubArea}
      <NumberInput
        className={c.root}
        {...rest}
        {...(variant.controlled ? { value } : { defaultValue })}
        format={variant.format && formats[variant.format]}
        form={variant.place === "outside" ? variant.id : undefined}
        controller={
          variant.controller || variant.scrub?.outside ? controller : undefined
        }
        onValueChange={(next, details) => {
          setValue(next)
          log.change(`${describe(next)} (${details.reason})`)
        }}
        onValueCommit={(next, details) =>
          log.commit(`${describe(next)} (${details.reason})`)
        }
      >
        {variant.scrub && !variant.scrub.outside && scrubArea}
        <NumberInputGroup className={c.group}>
          <NumberInputDecrement className={c.step} aria-label="Decrease">
            −
          </NumberInputDecrement>
          <NumberInputControl
            className={c.input}
            aria-label={field ? undefined : "Amount"}
          />
          <NumberInputIncrement className={c.step} aria-label="Increase">
            +
          </NumberInputIncrement>
        </NumberInputGroup>
      </NumberInput>
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
            <>
              <button
                type="button"
                className={c.button}
                onClick={() => controller.decrement()}
              >
                Decrement
              </button>
              <button
                type="button"
                className={c.button}
                onClick={() => controller.increment({ large: true })}
              >
                Increment large
              </button>
              <button
                type="button"
                className={c.button}
                onClick={() => controller.focus()}
              >
                Focus
              </button>
            </>
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
      <Field className={c.form} name="quantity">
        <FieldLabel className={c.label}>Quantity</FieldLabel>
        {control}
        <FieldDescription className={c.description}>
          How many to order.
        </FieldDescription>
        <FieldError className={c.error} />
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
