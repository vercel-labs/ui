import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import {
  fieldRadiosFixture as f,
  fieldRadiosOptions,
} from "tests/fixtures/field.ts"

function Fixture() {
  const { disabledField } = fieldRadiosOptions()
  const [firstDisabled, setFirstDisabled] = createSignal(false)
  return (
    <div class="fixture">
      <button>Before</button>
      <Field>
        <FieldLabel>{f.label}</FieldLabel>
        <RadioGroup class="form" name={f.name}>
          <For each={f.sizes}>
            {(size, index) => (
              <Field class="row" disabled={index() === 0 && disabledField}>
                <Radio
                  class="radio"
                  value={size.value}
                  disabled={index() === 0 && firstDisabled()}
                >
                  <RadioIndicator class="radio-indicator" />
                </Radio>
                <FieldLabel>{size.label}</FieldLabel>
              </Field>
            )}
          </For>
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
  render(() => <Fixture />, root)
}

export { Fixture, mount }
