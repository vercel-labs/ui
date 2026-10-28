import {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/solid/date-picker"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import {
  datePickerFieldFixture as f,
  datePickerFieldOptions,
  datePickerFixture,
} from "tests/fixtures/date-picker.ts"

function Fixture() {
  const { required, disabled } = datePickerFieldOptions()
  const [submitted, setSubmitted] = createSignal("")
  const [shown, setShown] = createSignal(true)
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <Field class="field" name={datePickerFixture.name} disabled={disabled}>
          <FieldLabel>{f.label}</FieldLabel>
          <Show when={shown()}>
            <DatePicker class="date-picker" today={datePickerFixture.today} required={required}>
              <DatePickerInput />
              <DatePickerTrigger />
              <DatePickerHint class="date-picker-hint" />
              <DatePickerContent class="date-picker-content" />
            </DatePicker>
          </Show>
          <FieldDescription>{f.description}</FieldDescription>
          <FieldError class="field-error" />
        </Field>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setShown(false)}>
          Remove date picker
        </button>
      </form>
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
