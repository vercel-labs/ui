import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/solid/field"
import { Input, InputClear, InputGroup } from "@ui-sdk/solid/input"
import { Textarea } from "@ui-sdk/solid/textarea"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"

// Parts rendered as other elements, and render functions reading state.
function Fixture() {
  const [renders, setRenders] = createSignal(0)
  return (
    <div class="fixture">
      <button>Before</button>
      <FieldSet class="form">
        <FieldLegend render={(props) => <div {...props} />}>
          Legend as a div
        </FieldLegend>
        <Field>
          <FieldLabel>Render function</FieldLabel>
          <Input
            class="input"
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
            class={(state) =>
              `textarea ${state.filled ? "is-filled" : "is-empty"}`
            }
          />
        </Field>
        <InputGroup class="input-group">
          <Input class="input" aria-label="Search" />
          <InputClear
            render={(props) => <span {...props} role="button" tabindex={0} />}
            aria-label="Clear search"
          >
            ×
          </InputClear>
        </InputGroup>
      </FieldSet>
      <button type="button" onClick={() => setRenders((count) => count + 1)}>
        Render again ({renders()})
      </button>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
