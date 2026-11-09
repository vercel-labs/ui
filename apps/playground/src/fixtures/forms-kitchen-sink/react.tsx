import { createCheckboxController } from "@ui-sdk/core/checkbox"
import { createRadioGroupController } from "@ui-sdk/core/radio"
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
import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"

function Indicator({ variant, radio }: { variant: Variant; radio?: boolean }) {
  const className = `${radio ? c.dot : c.indicator} ${variant.indicator === "animated" ? c.animated : ""} ${variant.indicator === "kept" ? c.kept : ""}`
  return radio ? (
    <RadioIndicator
      className={className}
      keepMounted={variant.indicator === "kept"}
    />
  ) : (
    <CheckboxIndicator
      className={className}
      keepMounted={variant.indicator === "kept"}
    />
  )
}

function Control({
  variant,
  log,
}: {
  variant: Variant
  log: (text: string) => void
}) {
  const [checked, setChecked] = React.useState<boolean | "indeterminate">(false)
  const [value, setValue] = React.useState<string | null>(null)
  const [values, setValues] = React.useState<string[]>([])
  const [checkbox] = React.useState(() => createCheckboxController())
  const [radio] = React.useState(() => createRadioGroupController())
  const options = (variant.options ?? {}) as Record<string, any>
  const report = (value: unknown, details: { reason: string }) =>
    log(`${JSON.stringify(value)} (${details.reason})`)

  if (variant.kind === "checkbox") {
    return (
      <>
        <label className={c.row}>
          <Checkbox
            className={c.box}
            {...options}
            {...(variant.controlled && { checked })}
            controller={variant.controller ? checkbox : undefined}
            form={variant.place === "outside" ? variant.id : undefined}
            onCheckedChange={(next, details) => {
              setChecked(next)
              report(next, details)
            }}
          >
            <Indicator variant={variant} />
          </Checkbox>
          Accept
        </label>
        {variant.controlled && <span>checked: {String(checked)}</span>}
        {variant.controller && (
          <button
            type="button"
            className={c.button}
            onClick={() => checkbox.toggle()}
          >
            Toggle from outside
          </button>
        )}
      </>
    )
  }
  if (variant.kind === "switch") {
    return (
      <label className={c.row}>
        <Switch
          className={c.track}
          {...options}
          {...(variant.controlled && { checked: checked === true })}
          onCheckedChange={(next, details) => {
            setChecked(next)
            report(next, details)
          }}
        >
          <SwitchThumb className={c.thumb} />
        </Switch>
        Wi-Fi
      </label>
    )
  }
  if (variant.kind === "radio") {
    return (
      <>
        <RadioGroup
          className={c.form}
          aria-label="Plan"
          {...options}
          {...(variant.controlled && { value })}
          controller={variant.controller ? radio : undefined}
          onValueChange={(next, details) => {
            setValue(next)
            report(next, details)
          }}
        >
          {variant.items!.map(([item, label, disabled]) => (
            <label key={item} className={c.row}>
              <Radio className={c.radio} value={item} disabled={disabled}>
                <Indicator variant={variant} radio />
              </Radio>
              {label}
            </label>
          ))}
        </RadioGroup>
        {variant.controlled && <span>value: {String(value)}</span>}
        {variant.controller && (
          <button
            type="button"
            className={c.button}
            onClick={() => radio.setValue("enterprise")}
          >
            Choose Enterprise
          </button>
        )}
      </>
    )
  }
  if (variant.kind === "checkbox-group") {
    return (
      <>
        <CheckboxGroup
          className={c.form}
          aria-label="Toppings"
          {...options}
          {...(variant.controlled && { value: values })}
          onValueChange={(next, details) => {
            setValues(next)
            report(next, details)
          }}
        >
          {variant.parent && (
            <label className={c.row}>
              <Checkbox className={c.box} parent>
                <Indicator variant={variant} />
              </Checkbox>
              All
            </label>
          )}
          {variant.items!.map(([item, label, disabled]) => (
            <label key={item} className={c.row}>
              <Checkbox className={c.box} value={item} disabled={disabled}>
                <Indicator variant={variant} />
              </Checkbox>
              {label}
            </label>
          ))}
        </CheckboxGroup>
        {variant.controlled && <span>value: {values.join(", ")}</span>}
      </>
    )
  }
  return <FieldControl className={c.input} type="email" name="email" required />
}

function Card({
  variant,
  log,
}: {
  variant: Variant
  log: (text: string) => void
}) {
  const control = <Control variant={variant} log={log} />
  const field = variant.field && (
    <Field
      className={c.form}
      invalid={variant.field.invalid}
      disabled={variant.field.disabled}
    >
      <FieldLabel>Label</FieldLabel>
      {control}
      <FieldDescription className={c.description}>Description</FieldDescription>
      <FieldError className={c.error} />
    </Field>
  )
  const body = field ?? control
  const placed =
    variant.place === "fieldset" ? (
      <fieldset disabled>{body}</fieldset>
    ) : variant.place === "rtl" ? (
      <div dir="rtl">{body}</div>
    ) : (
      body
    )
  return (
    <>
      <form id={variant.id} className={c.form} noValidate={false}>
        {variant.place !== "outside" && placed}
        <div className={c.row}>
          <button className={c.button}>Submit</button>
          <button type="reset" className={c.button}>
            Reset
          </button>
        </div>
      </form>
      {variant.place === "outside" && placed}
    </>
  )
}

function mount(root: HTMLElement) {
  renderShell(root, (slot, variant, log) =>
    createRoot(slot).render(<Card variant={variant} log={log} />)
  )
}

export { mount }
