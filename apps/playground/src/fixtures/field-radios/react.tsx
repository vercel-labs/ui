import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  fieldRadiosFixture as f,
  fieldRadiosOptions,
} from "tests/fixtures/field.ts"

function Fixture() {
  const { disabledField } = fieldRadiosOptions()
  const [firstDisabled, setFirstDisabled] = React.useState(false)
  return (
    <div className="fixture">
      <button>Before</button>
      <Field>
        <FieldLabel>{f.label}</FieldLabel>
        <RadioGroup className="form" name={f.name}>
          {f.sizes.map((size, index) => (
            <Field
              key={size.value}
              className="row"
              disabled={index === 0 && disabledField}
            >
              <Radio
                className="radio"
                value={size.value}
                disabled={index === 0 && firstDisabled}
              >
                <RadioIndicator className="radio-indicator" />
              </Radio>
              <FieldLabel>{size.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </Field>
      <button>After</button>
      <button onClick={() => setFirstDisabled((disabled) => !disabled)}>
        {f.disableFirst}
      </button>
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
