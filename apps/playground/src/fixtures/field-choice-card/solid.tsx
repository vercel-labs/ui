import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/solid/field"
import { render } from "@solidjs/web"
import { createSignal, For, onCleanup, Show } from "solid-js"
import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

function LaterCard() {
  const [ready, setReady] = createSignal(false)
  const timer = setTimeout(() => setReady(true), f.later.delay)
  onCleanup(() => clearTimeout(timer))
  return (
    <FieldLabel class="choice-card">
      <Field>
        <Show when={ready()}>
          <Checkbox class="checkbox" name={f.later.name}>
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
        </Show>
        <span>{f.later.title}</span>
        <FieldDescription>{f.later.description}</FieldDescription>
      </Field>
    </FieldLabel>
  )
}

function Fixture() {
  const { alone, later } = fieldChoiceCardOptions()
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
      <Show when={later}>
        <LaterCard />
      </Show>
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
