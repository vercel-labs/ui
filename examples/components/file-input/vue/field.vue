<script setup lang="ts">
import { Field, FieldDescription, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/vue/file-input"
import { ref } from "vue"

const sent = ref(false)
</script>

<template>
  <form data-slot="stack" @submit.prevent="sent = true" @reset="sent = false">
    <Field>
      <FieldLabel> Proof of address </FieldLabel>
      <FileInput v-slot="{ state }" name="proof" required :accept="['image/*', '.pdf']">
        <FileInputDropzone>
          <span data-slot="hint">{{ state.value[0]?.name ?? "Drop a scan here" }}</span>
          <FileInputTrigger>{{ state.value[0] ? "Replace" : "Choose a file" }}</FileInputTrigger>
        </FileInputDropzone>
      </FileInput>
      <FieldDescription> A utility bill or bank statement from the last 3 months. </FieldDescription>
      <div>
        <FieldError match="valueMissing">Add a scan to continue.</FieldError>
      </div>
    </Field>
    <div data-slot="row">
      <button type="submit">Continue</button>
      <button type="reset">Reset</button>
      <span data-slot="output">{{ sent ? "Sent." : "" }}</span>
    </div>
  </form>
</template>
