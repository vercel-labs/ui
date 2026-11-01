<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const status = ref("")

function submit(event: Event) {
  status.value = `Subscribed ${new FormData(event.currentTarget as HTMLFormElement).get("email")}.`
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" required placeholder="m@example.com" />
      <FieldDescription v-slot="{ state }">
        {{ state.valid ? "Looks good." : "We'll send you a confirmation link." }}
      </FieldDescription>
      <div>
        <FieldError match="valueMissing">Enter your email address.</FieldError>
        <FieldError match="typeMismatch"> Enter an email address like m@example.com. </FieldError>
      </div></Field
    >
    <Field name="website">
      <FieldLabel>Website</FieldLabel>
      <FieldControl type="url" required placeholder="https://example.com" />
      <div>
        <FieldError v-slot="{ state }">{{ state.message }}</FieldError>
      </div></Field
    >
    <button type="submit">Subscribe</button>
    <output data-slot="output">{{ status }}</output>
  </form>
</template>
