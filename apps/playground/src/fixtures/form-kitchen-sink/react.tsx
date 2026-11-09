import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@ui-sdk/react/field"
import {
  Input,
  InputClear,
  InputGroup,
  createInputController,
} from "@ui-sdk/react/input"
import { Textarea } from "@ui-sdk/react/textarea"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { classes as c, renderShell } from "./shell"
import type { Variant } from "./variants"

function Control({
  variant,
  log,
}: {
  variant: Variant
  log: (text: string) => void
}) {
  const [value, setValue] = React.useState("")
  const [input] = React.useState(() => createInputController())
  const options = (variant.options ?? {}) as Record<string, any>
  const change = {
    ...(variant.controlled && { value }),
    controller: variant.controller === "input" ? input : undefined,
    onValueChange: (
      next: string,
      details: { reason: string; cancel: () => void }
    ) => {
      if (variant.digitsCanceled && /\d/.test(next)) {
        return details.cancel()
      }
      setValue(next)
      log(`${JSON.stringify(next)} (${details.reason})`)
    },
  }
  if (variant.kind === "set") {
    const set = (
      <FieldSet className={c.set} {...options}>
        <FieldLegend
          className={c.legend}
          render={variant.legendAsDiv ? <div /> : undefined}
        >
          Address
        </FieldLegend>
        <FieldDescription className="text-xs">
          Where we send it.
        </FieldDescription>
        <Field name="value" className={c.field}>
          <FieldLabel className={c.label}>Street</FieldLabel>
          <Input className={c.input} required />
        </Field>
      </FieldSet>
    )
    return variant.place === "disabled-fieldset" ? (
      <fieldset disabled>{set}</fieldset>
    ) : (
      set
    )
  }
  const control =
    variant.kind === "textarea" ? (
      <Textarea className={c.textarea} {...options} {...change} />
    ) : variant.kind === "group" ? (
      <InputGroup className={c.group}>
        {variant.prefix && <span>{variant.prefix}</span>}
        <Input className={c.groupInput} {...options} {...change} />
        <InputClear className={c.clear} aria-label="Clear">
          ×
        </InputClear>
      </InputGroup>
    ) : (
      <Input
        className={c.input}
        aria-label={variant.field ? undefined : "Value"}
        {...options}
        {...change}
      />
    )
  return (
    <>
      {variant.field ? (
        <Field
          name="value"
          className={c.field}
          invalid={variant.invalid ? true : undefined}
        >
          <FieldLabel className={c.label}>Value</FieldLabel>
          {control}
          <FieldError className={c.error}>{variant.invalid}</FieldError>
        </Field>
      ) : (
        control
      )}
      {variant.controller === "input" && (
        <div className={c.row}>
          <button
            type="button"
            className={c.button}
            onClick={() => input.setValue("Grace")}
          >
            Set
          </button>
          <button
            type="button"
            className={c.button}
            onClick={() => input.clear()}
          >
            Clear value
          </button>
        </div>
      )}
    </>
  )
}

function Card({
  variant,
  log,
}: {
  variant: Variant
  log: (text: string) => void
}) {
  const card = (
    <form
      className={c.form}
      onSubmit={(event) => {
        event.preventDefault()
        log(
          `submitted ${new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>)}`
        )
      }}
    >
      <Control variant={variant} log={log} />
      <div className={c.row}>
        <button type="submit" className={c.button}>
          Submit
        </button>
        <button type="reset" className={c.button}>
          Reset
        </button>
      </div>
    </form>
  )
  if (variant.place === "rtl") {
    return <div dir="rtl">{card}</div>
  }
  return card
}

function mount(root: HTMLElement) {
  renderShell(root, (slot, variant, log) =>
    createRoot(slot).render(
      <React.StrictMode>
        <Card variant={variant} log={log} />
      </React.StrictMode>
    )
  )
}

export { mount }
