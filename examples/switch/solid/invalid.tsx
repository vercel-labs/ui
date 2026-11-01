import { Field, FieldError, FieldLabel } from "@ui-sdk/solid/field"
import { Switch, SwitchThumb } from "@ui-sdk/solid/switch"
import { createSignal } from "solid-js"

function Example() {
  const [submitted, setSubmitted] = createSignal(false)

  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(true)
      }}
    >
      <Field>
        <div data-slot="row">
          <Switch name="terms" required onCheckedChange={() => setSubmitted(false)}>
            <SwitchThumb />
          </Switch>
          <FieldLabel>I agree to the terms</FieldLabel>
        </div>
        <div>
          <FieldError match="valueMissing">You must agree to the terms to continue.</FieldError>
        </div>
      </Field>
      <button type="submit">Continue</button>
      <output data-slot="output">{submitted() ? "Thanks, you're all set." : ""}</output>
    </form>
  )
}

export { Example }
