import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import {
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
  NumberInputScrubArea,
} from "@ui-sdk/react/number-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { numberInputFixture as f, numberInputOptions, serialize } from "tests/fixtures/number-input.ts"

function Fixture() {
  const options = numberInputOptions()
  const [action, setAction] = React.useState("")
  const [commits, setCommits] = React.useState<string[]>([])
  const [submitted, setSubmitted] = React.useState("")
  const [quantity, setQuantity] = React.useState<number | null>(options.quantity)
  // Records a change, or cancels it when the URL asks.
  const report = (name: string, value: number | null, details: { cancel: () => void }) => {
    if (options.cancel === name) return details.cancel()
    setAction(`${name}:${String(value)}`)
  }
  const commit = (name: string) => (value: number | null) =>
    setCommits((list) => [...list, `${name}:${String(value)}`])
  const shared = {
    wheel: options.wheel,
    disabled: options.disabled,
    readOnly: options.readOnly,
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
        {/* The field names the quantity, so the field's name reaches the form. */}
        <Field name={f.quantity.name}>
          <FieldLabel>{f.quantity.label}</FieldLabel>
          <NumberInput
            {...shared}
            min={f.quantity.min}
            max={f.quantity.max}
            required={options.required}
            {...(options.controlled ? { value: quantity } : { defaultValue: options.quantity })}
            onValueChange={(value, details) => {
              report(f.quantity.name, value, details)
              if (!details.canceled) setQuantity(value)
            }}
            onValueCommit={commit(f.quantity.name)}
          >
            <NumberInputGroup className="number-input-group">
              <NumberInputDecrement aria-label={f.quantity.decrement}>−</NumberInputDecrement>
              <NumberInputControl className="number-input-control" />
              <NumberInputIncrement aria-label={f.quantity.increment} disabled={options.disabledIncrement}>
                +
              </NumberInputIncrement>
            </NumberInputGroup>
          </NumberInput>
          <FieldDescription>{f.quantity.description}</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>{f.amount.label}</FieldLabel>
          <NumberInput
            {...shared}
            name={f.amount.name}
            defaultValue={f.amount.defaultValue}
            min={options.amountMin}
            step={f.amount.step}
            format={{ style: "currency", currency: f.amount.currency }}
            onValueChange={(value, details) => report(f.amount.name, value, details)}
            onValueCommit={commit(f.amount.name)}
          >
            <NumberInputScrubArea className="number-input-scrub">{f.amount.scrub}</NumberInputScrubArea>
            <NumberInputGroup className="number-input-group">
              <NumberInputDecrement aria-label={f.amount.decrement}>−</NumberInputDecrement>
              <NumberInputControl className="number-input-control" />
              <NumberInputIncrement aria-label={f.amount.increment}>+</NumberInputIncrement>
            </NumberInputGroup>
          </NumberInput>
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
    </React.StrictMode>,
  )
}

export { Fixture, mount }
