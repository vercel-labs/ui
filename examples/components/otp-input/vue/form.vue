<script setup lang="ts">
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { ref } from "vue"

const submitted = ref("")

function onSubmit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join(", ")
}
</script>

<template>
  <div data-slot="stack">
    <form id="verify" data-slot="stack" @submit.prevent="onSubmit" @reset="submitted = ''">
      <Field>
        <FieldLabel>Verification code</FieldLabel>
        <OTPInput name="code" required auto-complete="one-time-code">
          <OTPInputGroup>
            <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
          </OTPInputGroup>
        </OTPInput>
        <FieldDescription>Enter the six-digit code from your message.</FieldDescription>
        <div><FieldError /></div>
      </Field>
      <div data-slot="row">
        <button type="submit">Verify</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <Field>
      <FieldLabel>Recovery code (optional)</FieldLabel>
      <OTPInput name="recovery" form="verify" :max-length="8" pattern="alphanumeric">
        <OTPInputGroup>
          <OTPInputSlot v-for="index in 8" :key="index" :index="index - 1" />
        </OTPInputGroup>
      </OTPInput>
    </Field>
    <output data-slot="output">{{ submitted ? `Submitted: ${submitted}` : "" }}</output>
  </div>
</template>
