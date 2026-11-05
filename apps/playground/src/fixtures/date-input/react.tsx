import { createDateInputController, DateInput } from "@ui-sdk/react/date-input"
import { Field, FieldError, FieldLabel } from "@ui-sdk/react/field"
import { TimeInput } from "@ui-sdk/react/time-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { dateInputAction, dateInputFixture, dateInputOptions } from "tests/fixtures/date-input.ts"

const controller = createDateInputController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const { date, time, cancel, ...shared } = dateInputOptions()
  const f = dateInputFixture
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        aria-label={f.form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <Field className="field" name={f.date.name}>
          <FieldLabel>{f.date.label}</FieldLabel>
          <DateInput
            className="date-input"
            controller={controller}
            {...date}
            {...shared}
            onValueChange={(value, details) => {
              if (cancel && value === cancel) return details.cancel()
              setAction(dateInputAction.change("date", value, details.reason))
            }}
          />
          <FieldError className="field-error" />
        </Field>
        <Field className="field" name={f.time.name}>
          <FieldLabel>{f.time.label}</FieldLabel>
          <TimeInput
            className="date-input"
            {...time}
            {...shared}
            onValueChange={(value, details) =>
              setAction(dateInputAction.change("time", value, details.reason))
            }
          />
        </Field>
        <button type="submit">{f.form.submit}</button>
        <button type="reset">{f.form.reset}</button>
      </form>
      <button onClick={() => controller.setValue(f.filled)}>Set date</button>
      <button onClick={() => controller.clear()}>Clear date</button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Submitted">{submitted}</output>
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
