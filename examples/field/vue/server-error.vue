<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const email = ref("ada@example.com")
const serverError = ref<string | null>(null)
const pending = ref(false)
const status = ref("")

function register(email: string) {
  return new Promise<string | null>((resolve) =>
    setTimeout(() => resolve(email === "ada@example.com" ? "This email is already registered." : null), 400),
  )
}

async function submit(event: Event) {
  const email = String(new FormData(event.currentTarget as HTMLFormElement).get("email"))
  pending.value = true
  const message = await register(email)
  pending.value = false
  serverError.value = message
  status.value = message ? "" : `Account created for ${email}.`
}

function edit(event: Event) {
  email.value = (event.target as HTMLInputElement).value
  serverError.value = null
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field name="email" :invalid="serverError !== null || undefined">
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" :readonly="pending" required :value="email" @input="edit" />
      <FieldDescription>We'll email you a sign-in link.</FieldDescription>
      <div>
        <FieldError match="valueMissing">Enter your email address.</FieldError>
        <FieldError match="typeMismatch"> Enter an email address like m@example.com. </FieldError>
        <FieldError v-if="serverError" match>{{ serverError }}</FieldError>
      </div></Field
    >
    <button type="submit" :disabled="pending">
      {{ pending ? "Creating…" : "Create account" }}
    </button>
    <output data-slot="output">{{ status }}</output>
  </form>
</template>
