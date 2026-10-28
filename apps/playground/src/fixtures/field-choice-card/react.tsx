import { Checkbox, CheckboxIndicator } from "@ui-sdk/react/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/react/field"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

function LaterCard() {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const timer = setTimeout(() => setReady(true), f.later.delay)
    return () => clearTimeout(timer)
  }, [])
  return (
    <FieldLabel className="choice-card">
      <Field>
        {ready && (
          <Checkbox className="checkbox" name={f.later.name}>
            <CheckboxIndicator className="checkbox-indicator" />
          </Checkbox>
        )}
        <span>{f.later.title}</span>
        <FieldDescription>{f.later.description}</FieldDescription>
      </Field>
    </FieldLabel>
  )
}

function Fixture() {
  const { alone, later } = fieldChoiceCardOptions()
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
      {later && <LaterCard />}
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
