<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Textarea, createInputController } from "@ui-sdk/vue/textarea"
import { ref } from "vue"

const message = createInputController()
const sent = ref<string[]>([])

function send(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  sent.value = [...sent.value, String(data.get("message"))]
  message.clear()
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="send">
    <Field name="message">
      <FieldLabel>Message</FieldLabel>
      <Textarea :controller="message" required auto-resize />
    </Field>
    <button type="submit">Send message</button>
    <p data-slot="output">
      {{ sent.length ? `Sent: ${sent.at(-1)}` : "Nothing sent yet." }}
    </p>
  </form>
</template>
