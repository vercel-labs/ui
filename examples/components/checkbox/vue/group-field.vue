<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const channels = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notifications" },
]

const saved = ref<string | null>(null)

function onSubmit(event: Event) {
  saved.value = new FormData(event.target as HTMLFormElement).getAll("notifications").join(", ")
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="onSubmit">
    <Field>
      <FieldLabel>Notifications</FieldLabel>
      <FieldDescription> Choose how we tell you about your orders. </FieldDescription>
      <CheckboxGroup name="notifications" required>
        <label data-slot="label" v-for="channel in channels" :key="channel.value">
          <Checkbox :value="channel.value">
            <CheckboxIndicator>
              <CheckIcon aria-hidden="true" />
            </CheckboxIndicator>
          </Checkbox>
          {{ channel.label }}
        </label>
      </CheckboxGroup>
      <div>
        <FieldError>Choose at least one way to be notified.</FieldError>
      </div>
    </Field>
    <button type="submit">Save</button>
    <output data-slot="output">{{ saved !== null ? `notifications: ${saved}` : "" }}</output>
  </form>
</template>
