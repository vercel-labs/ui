import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Input, createInputController } from "@ui-sdk/solid/input"

export function Example() {
  const message = createInputController()
  return (
    <div data-slot="stack">
      <Field name="message">
        <FieldLabel>Message</FieldLabel>
        <Input
          controller={message}

          placeholder="Say something"
        />
      </Field>
      <div data-slot="row">
        <button type="button" onClick={() => message.setValue("On my way!")}>
          Quick reply
        </button>
        <button type="button" onClick={() => message.clear()}>
          Clear
        </button>
        <button type="button" onClick={() => message.focus()}>
          Focus
        </button>
      </div>
    </div>
  )
}
