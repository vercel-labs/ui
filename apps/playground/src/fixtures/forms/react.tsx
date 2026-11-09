import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
} from "@ui-sdk/react/checkbox"
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/react/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/react/radio"
import { Switch, SwitchThumb } from "@ui-sdk/react/switch"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  formsFixture as f,
  formsOptions,
  serialize,
} from "tests/fixtures/forms.ts"

function Fixture() {
  const options = formsOptions()
  const [action, setAction] = React.useState("")
  const [source, setSource] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const [terms, setTerms] = React.useState<boolean | "indeterminate">(false)
  const [shipping, setShipping] = React.useState(false)
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
    <div className="fixture">
      <button>Before</button>
      <form
        className="form"
        id={f.formId}
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serialize(event.currentTarget))
        }}
      >
        <Field>
          <div className="row">
            <Checkbox
              className="checkbox"
              name={f.terms.name}
              value={f.terms.value}
              required
              readOnly={options.readOnly}
              {...(options.controlled && { checked: terms })}
              onCheckedChange={(checked, details) => {
                report(f.terms.name, checked, details)
                if (!details.canceled) {
                  setTerms(checked)
                }
              }}
            >
              <CheckboxIndicator className="checkbox-indicator" />
            </Checkbox>
            <FieldLabel>{f.terms.label}</FieldLabel>
          </div>
          <FieldDescription>{f.terms.description}</FieldDescription>
          <FieldError className="field-error" match="valueMissing">
            {f.terms.error}
          </FieldError>
        </Field>

        <fieldset>
          <legend id={f.toppings.legendId}>{f.toppings.legend}</legend>
          <CheckboxGroup
            className="form"
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
              <Checkbox className="checkbox" parent>
                <CheckboxIndicator className="checkbox-indicator" />
              </Checkbox>
              {f.toppings.parent}
            </label>
            {f.toppings.items.map((item) => (
              <label key={item.value}>
                <Checkbox className="checkbox" value={item.value}>
                  <CheckboxIndicator className="checkbox-indicator" />
                </Checkbox>
                {item.label}
              </label>
            ))}
          </CheckboxGroup>
        </fieldset>

        {f.switches.map((item) => (
          <label key={item.name}>
            <Switch
              className="switch"
              name={item.name}
              defaultChecked={item.defaultChecked}
              onCheckedChange={(checked, details) =>
                report(item.name, checked, details)
              }
            >
              <SwitchThumb className="switch-thumb" />
            </Switch>
            {item.label}
          </label>
        ))}

        <Field>
          <FieldLabel>{f.plan.label}</FieldLabel>
          <RadioGroup
            className="form"
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
            {f.plan.items.map((item) => (
              <label key={item.value}>
                <Radio
                  className="radio"
                  value={item.value}
                  disabled={item.disabled}
                >
                  <RadioIndicator className="radio-indicator" />
                </Radio>
                {item.label}
              </label>
            ))}
          </RadioGroup>
          <FieldDescription>{f.plan.description}</FieldDescription>
          <FieldError className="field-error" />
        </Field>

        <Field invalid={options.invalid}>
          <FieldLabel>{f.email.label}</FieldLabel>
          <FieldControl type="email" name={f.email.name} required />
          <FieldDescription>{f.email.description}</FieldDescription>
          <FieldError className="field-error" />
        </Field>

        {options.nickname && (
          <Field>
            <FieldLabel>{f.nickname.label}</FieldLabel>
            <FieldControl name={f.nickname.name} required />
          </Field>
        )}

        <fieldset disabled={shipping}>
          <legend>{f.shipping.legend}</legend>
          <label>
            <Checkbox className="checkbox" name={f.shipping.name}>
              <CheckboxIndicator className="checkbox-indicator" />
            </Checkbox>
            {f.shipping.label}
          </label>
        </fieldset>

        <div className="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <label>
        <Checkbox
          className="checkbox"
          form={f.formId}
          name={f.newsletter.name}
          value={f.newsletter.value}
        >
          <CheckboxIndicator className="checkbox-indicator" />
        </Checkbox>
        {f.newsletter.label}
      </label>
      <button type="button" onClick={() => setShipping((value) => !value)}>
        Toggle shipping
      </button>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Last source">{source}</output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
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

export { Fixture, mount }
