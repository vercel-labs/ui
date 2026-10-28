import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { fieldRadiosFixture as f } from "tests/fixtures/field.ts"

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Field>
        <FieldLabel>{f.label}</FieldLabel>
        <RadioGroup className="form" name={f.name}>
          {f.sizes.map((size) => (
            <Field key={size.value} className="row">
              <Radio className="radio" value={size.value}>
                <RadioIndicator className="radio-indicator" />
              </Radio>
              <FieldLabel>{size.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </Field>
      <button>After</button>
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
