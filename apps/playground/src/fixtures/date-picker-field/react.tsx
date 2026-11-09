import {
  DatePicker,
  DatePickerContent,
  DatePickerHint,
  DatePickerInput,
  DatePickerTrigger,
} from "@ui-sdk/react/date-picker"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  datePickerFieldFixture as f,
  datePickerFieldOptions,
  datePickerFixture,
} from "tests/fixtures/date-picker.ts"

function Fixture() {
  const { required, disabled } = datePickerFieldOptions()
  const [submitted, setSubmitted] = React.useState("")
  const [shown, setShown] = React.useState(true)
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(JSON.stringify([...new FormData(event.currentTarget)]))
        }}
      >
        <Field
          className="field"
          name={datePickerFixture.name}
          disabled={disabled}
        >
          <FieldLabel>{f.label}</FieldLabel>
          {shown && (
            <DatePicker
              className="date-picker"
              today={datePickerFixture.today}
              required={required}
            >
              <DatePickerInput />
              <DatePickerTrigger />
              <DatePickerHint className="date-picker-hint" />
              <DatePickerContent className="date-picker-content" />
            </DatePicker>
          )}
          <FieldDescription>{f.description}</FieldDescription>
          <FieldError className="field-error" />
        </Field>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => setShown(false)}>
          Remove date picker
        </button>
      </form>
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
