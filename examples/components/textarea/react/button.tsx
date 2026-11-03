import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Textarea, createInputController } from "@ui-sdk/react/textarea"
import * as React from "react"

export function Example() {
  const [message] = React.useState(createInputController)
  const [sent, setSent] = React.useState<string[]>([])
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
      <p data-slot="output">{sent.length ? `Sent: ${sent.at(-1)}` : "Nothing sent yet."}</p>
    </form>
  )
}
