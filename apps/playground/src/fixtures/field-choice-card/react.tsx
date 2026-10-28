import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

function Fixture() {
  const { alone } = fieldChoiceCardOptions()
  return (
    <div className="fixture">
      <button>Before</button>
      {f.cards.map((card) => (
        <FieldLabel key={card.name} className="choice-card">
          <Field>
            <Checkbox className="checkbox" name={card.name}>
              <CheckboxIndicator className="checkbox-indicator" />
            </Checkbox>
            <span>{card.title}</span>
            <FieldDescription>{card.description}</FieldDescription>
          </Field>
        </FieldLabel>
      ))}
      {alone && <FieldLabel>{f.alone}</FieldLabel>}
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
