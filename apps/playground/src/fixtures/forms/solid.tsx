import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/solid/checkbox"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/solid/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/solid/radio"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import {
  formsFixture as f,
  formsOptions,
  serialize,
} from "tests/fixtures/forms.ts"

function Fixture() {
  const options = formsOptions()
  const [action, setAction] = createSignal("")
  const [source, setSource] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const [terms, setTerms] = createSignal<boolean | "indeterminate">(false)
  const [shipping, setShipping] = createSignal(false)
  const all = f.toppings.items.map((item) => item.value)
  // Records a change, or cancels it when the URL asks.
  const report = (
    name: string,
    value: unknown,
    details: { cancel: () => void; source: string }
  ) => {
    if (options.cancel === name) {
      return details.cancel()
    }
    setAction(`${name}:${String(value)}`)
    setSource(details.source)
  }

  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        id={f.formId}
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serialize(event.currentTarget))
        }}
      >
        <Field>
          <div class="row">
            <Checkbox
              class="checkbox"
              name={f.terms.name}
              value={f.terms.value}
              required
              readOnly={options.readOnly}
              checked={options.controlled ? terms() : undefined}
              onCheckedChange={(checked, details) => {
                report(f.terms.name, checked, details)
                if (!details.canceled) {
                  setTerms(checked)
                }
              }}
            >
              <CheckboxIndicator class="checkbox-indicator" />
            </Checkbox>
            <FieldLabel>{f.terms.label}</FieldLabel>
          </div>
          <FieldDescription>{f.terms.description}</FieldDescription>
          <FieldError class="field-error" match="valueMissing">
            {f.terms.error}
          </FieldError>
        </Field>

        <fieldset>
          <legend id={f.toppings.legendId}>{f.toppings.legend}</legend>
          <CheckboxGroup
            class="form"
            aria-labelledby={f.toppings.legendId}
            name={f.toppings.name}
            defaultValue={f.toppings.defaultValue}
            allValues={all}
            required={options.toppingsRequired}
            onValueChange={(value, details) =>
              report(f.toppings.name, value.join(","), details)
            }
          >
            <label>
              <Checkbox class="checkbox" parent>
                <CheckboxIndicator class="checkbox-indicator" />
              </Checkbox>
              {f.toppings.parent}
            </label>
            <For each={f.toppings.items}>
              {(item) => (
                <label>
                  <Checkbox class="checkbox" value={item.value}>
                    <CheckboxIndicator class="checkbox-indicator" />
                  </Checkbox>
                  {item.label}
                </label>
              )}
            </For>
          </CheckboxGroup>
        </fieldset>

        <For each={f.switches}>
          {(item) => (
            <label>
              <Switch
                class="switch"
                name={item.name}
                defaultChecked={item.defaultChecked}
                onCheckedChange={(checked, details) =>
                  report(item.name, checked, details)
                }
              >
                <SwitchThumb class="switch-thumb" />
              </Switch>
              {item.label}
            </label>
          )}
        </For>

        <Field>
          <FieldLabel>{f.plan.label}</FieldLabel>
          <RadioGroup
            class="form"
            name={f.plan.name}
            required
            defaultValue={options.plan}
            readOnly={options.readOnly}
            disabled={options.disabled}
            loop={options.loop}
            onValueChange={(value, details) =>
              report(f.plan.name, value, details)
            }
          >
            <For each={f.plan.items}>
              {(item) => (
                <label>
                  <Radio
                    class="radio"
                    value={item.value}
                    disabled={item.disabled}
                  >
                    <RadioIndicator class="radio-indicator" />
                  </Radio>
                  {item.label}
                </label>
              )}
            </For>
          </RadioGroup>
          <FieldDescription>{f.plan.description}</FieldDescription>
          <FieldError class="field-error" />
        </Field>

        <Field invalid={options.invalid}>
          <FieldLabel>{f.email.label}</FieldLabel>
          <FieldControl type="email" name={f.email.name} required />
          <FieldDescription>{f.email.description}</FieldDescription>
          <FieldError class="field-error" />
        </Field>

        {options.nickname && (
          <Field>
            <FieldLabel>{f.nickname.label}</FieldLabel>
            <FieldControl name={f.nickname.name} required />
          </Field>
        )}

        <fieldset disabled={shipping()}>
          <legend>{f.shipping.legend}</legend>
          <label>
            <Checkbox class="checkbox" name={f.shipping.name}>
              <CheckboxIndicator class="checkbox-indicator" />
            </Checkbox>
            {f.shipping.label}
          </label>
        </fieldset>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label>
        <Checkbox
          class="checkbox"
          form={f.formId}
          name={f.newsletter.name}
          value={f.newsletter.value}
        >
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        {f.newsletter.label}
      </label>
      <button type="button" onClick={() => setShipping((value) => !value)}>
        Toggle shipping
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output aria-label="Last source">{source()}</output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
