<script setup lang="ts">
import { TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/vue/token-input"
import { ref, useId } from "vue"

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

const submitted = ref("")
const disabled = ref(false)
const readOnly = ref(false)
const formId = useId()

function submit(event: Event) {
  submitted.value = String(new FormData(event.currentTarget as HTMLFormElement).get("prompt") ?? "")
}
</script>

<template>
  <div data-slot="stack">
    <div data-slot="row">
      <label data-slot="label">
        <input v-model="disabled" type="checkbox" />
        Disabled
      </label>
      <label data-slot="label">
        <input v-model="readOnly" type="checkbox" />
        Read-only
      </label>
    </div>
    <TokenInput
      :form="formId"
      name="prompt"
      required
      :default-value="draft"
      :disabled="disabled"
      :read-only="readOnly"
    >
      <label :id="`${formId}-label`" data-slot="label">Prompt</label>
      <TokenInputEditor :aria-labelledby="`${formId}-label`" />
    </TokenInput>
    <form @reset="submitted = ''" :id="formId" data-slot="stack" @submit.prevent="submit">
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
      <p data-slot="output">{{ submitted }}</p>
    </form>
  </div>
</template>
