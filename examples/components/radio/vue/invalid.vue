<script setup lang="ts">
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { ref } from "vue"

const options = [
  { value: "email", label: "Email only" },
  { value: "sms", label: "SMS only" },
  { value: "both", label: "Both email and SMS" },
]

const saved = ref("")

function submit(event: Event) {
  saved.value = String(new FormData(event.currentTarget as HTMLFormElement).get("notifications"))
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field>
      <FieldLabel>Notification preferences</FieldLabel>
      <FieldDescription> Choose how you want to receive notifications. </FieldDescription>
      <RadioGroup name="notifications" required>
        <label data-slot="label" v-for="option in options" :key="option.value">
          <Radio :value="option.value">
            <RadioIndicator />
          </Radio>
          {{ option.label }}
        </label>
      </RadioGroup>
      <FieldError>Choose how to receive notifications.</FieldError>
    </Field>
    <button type="submit">Save</button>
    <output data-slot="output" v-if="saved">Saved: {{ saved }}</output>
  </form>
</template>
