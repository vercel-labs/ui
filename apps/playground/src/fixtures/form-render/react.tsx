import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/react/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/react/input"
import { Textarea } from "@ui-sdk/react/textarea"
import * as React from "react"
import { createRoot } from "react-dom/client"

// Parts rendered as other elements, and render functions reading state.
function Fixture() {
  const [renders, setRenders] = React.useState(0)
  return (
    <div className="fixture">
      <button>Before</button>
      <FieldSet className="form">
        <FieldLegend render={<div />}>Legend as a div</FieldLegend>
        <Field>
          <FieldLabel>Render function</FieldLabel>
          <Input
            className="input"
            render={(props, state) => (
              <input
                {...props}
                data-state={state.filled ? "filled" : "empty"}
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Class from state</FieldLabel>
          <Textarea
            autoResize
            className={(state) =>
              `textarea ${state.filled ? "is-filled" : "is-empty"}`
            }
          />
        </Field>
        <InputGroup className="input-group">
          <Input className="input" aria-label="Search" />
          <InputClear
            render={<span role="button" tabIndex={0} />}
            aria-label="Clear search"
          >
            ×
          </InputClear>
        </InputGroup>
      </FieldSet>
      <button type="button" onClick={() => setRenders((count) => count + 1)}>
        Render again ({renders})
      </button>
      <button>After</button>
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

export { mount }
