import { Checkbox, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/solid/field"
import { Radio, RadioGroup } from "@ui-sdk/solid/radio"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"

function Fixture() {
  const [action, setAction] = createSignal("")
  const [nickname, setNickname] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        aria-label="Rendering"
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          <Checkbox
            class="checkbox"
            render={(props) => <span {...props} />}
            onCheckedChange={(checked) => setAction(`span:${checked}`)}
          >
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
          Rendered as a span
        </label>
        <Checkbox
          aria-label="Render function"
          render={(props, state) => (
            <button {...props}>{state.checked ? "On" : "Off"}</button>
          )}
        />
        <Checkbox
          aria-label="Class from state"
          class={(state) =>
            `checkbox ${state.checked ? "is-checked" : "is-unchecked"}`
          }
        />
        <label>
          <Switch class="switch" defaultChecked>
            <SwitchThumb
              render={(props, state) => (
                <span {...props}>{state.checked ? "I" : "O"}</span>
              )}
            />
          </Switch>
          Labelled thumb
        </label>
        <RadioGroup
          aria-label="Size"
          defaultValue="small"
          onValueChange={(value) => setAction(`size:${value}`)}
        >
          <For each={["small", "large"]}>
            {(value) => (
              <label>
                <Radio
                  class="radio"
                  value={value}
                  render={(props) => <span {...props} />}
                />
                {value === "small" ? "Small" : "Large"}
              </label>
            )}
          </For>
        </RadioGroup>
        <Field>
          <FieldLabel>Nickname</FieldLabel>
          <FieldControl
            value={nickname()}
            onInput={(event) => setNickname(event.currentTarget.value)}
          />
        </Field>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
