<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Textarea, createInputController } from "@ui-sdk/svelte/textarea"

  const message = createInputController()
  let sent = $state<string[]>([])

  function send(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.currentTarget as HTMLFormElement)
    sent = [...sent, String(data.get("message"))]
    message.clear()
  }
</script>

<form data-slot="stack" onsubmit={send}>
  <Field name="message">
    <FieldLabel>Message</FieldLabel>
    <Textarea controller={message} required autoResize />
  </Field>
  <button type="submit">
    Send message
  </button>
  <p data-slot="output">
    {sent.length ? `Sent: ${sent.at(-1)}` : "Nothing sent yet."}
  </p>
</form>
