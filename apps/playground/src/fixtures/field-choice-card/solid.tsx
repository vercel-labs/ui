import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { render } from "@solidjs/web"
import { For, Show } from "solid-js"
import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

function Fixture() {
  const { alone } = fieldChoiceCardOptions()
  return (
    <div class="fixture">
      <button>Before</button>
      <For each={f.cards}>
        {(card) => (
          <FieldLabel class="choice-card">
            <Field>
              <Checkbox class="checkbox" name={card.name}>
                <CheckboxIndicator class="checkbox-indicator" />
              </Checkbox>
              <span>{card.title}</span>
              <FieldDescription>{card.description}</FieldDescription>
            </Field>
          </FieldLabel>
        )}
      </For>
      <Show when={alone}>
        <FieldLabel>{f.alone}</FieldLabel>
      </Show>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
