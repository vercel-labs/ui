import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { fieldRadiosFixture as f } from "tests/fixtures/field.ts"

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Field>
        <FieldLabel>{f.label}</FieldLabel>
        <RadioGroup class="form" name={f.name}>
          <For each={f.sizes}>
            {(size) => (
              <Field class="row">
                <Radio class="radio" value={size.value}>
                  <RadioIndicator class="radio-indicator" />
                </Radio>
                <FieldLabel>{size.label}</FieldLabel>
              </Field>
            )}
          </For>
        </RadioGroup>
      </Field>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
