import { Field, FieldLabel } from "@ui-sdk/solid/field"
import { Textarea, createInputController } from "@ui-sdk/solid/textarea"
import { createSignal } from "solid-js"

export function Example() {
  const message = createInputController()
  const [sent, setSent] = createSignal<string[]>([])
  return (
    <form
      data-slot="stack"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setSent((list) => [...list, String(data.get("message"))])
        message.clear()
      }}
    >
      <Field name="message">
        <FieldLabel>Message</FieldLabel>
        <Textarea controller={message} required autoResize />
      </Field>
      <button type="submit">Send message</button>
      <p data-slot="output">{sent().length ? `Sent: ${sent().at(-1)}` : "Nothing sent yet."}</p>
    </form>
  )
}
