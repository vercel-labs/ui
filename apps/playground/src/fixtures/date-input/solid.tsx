import { createDateInputController, DateInput } from "@ui-sdk/solid/date-input"
import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { TimeInput } from "@ui-sdk/solid/time-input"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { dateInputAction, dateInputFixture as f, dateInputOptions } from "tests/fixtures/date-input.ts"

const controller = createDateInputController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const { date, time, cancel, ...shared } = dateInputOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        aria-label={f.form.label}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <Field class="field" name={f.date.name}>
          <FieldLabel>{f.date.label}</FieldLabel>
          <DateInput
            class="date-input"
            controller={controller}
            {...date}
            {...shared}
            onValueChange={(value, details) => {
              if (cancel && value === cancel) return details.cancel()
              setAction(dateInputAction.change("date", value, details.reason))
            }}
          />
          <FieldError class="field-error" />
        </Field>
        <Field class="field" name={f.time.name}>
          <FieldLabel>{f.time.label}</FieldLabel>
          <TimeInput
            class="date-input"
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
        {action()}
      </output>
      <output aria-label="Submitted">{submitted()}</output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
