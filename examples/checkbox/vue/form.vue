<script setup lang="ts">
import { Check } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { ref } from "vue"

const formId = "checkbox-signup"
const submitted = ref("")

function onSubmit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  const entries = [...data].map(([name, value]) => `${name}=${value}`)
  submitted.value = entries.join(", ") || "nothing"
}
</script>

<template>
  <div data-slot="stack">
    <form data-slot="stack" :id="formId" @submit.prevent="onSubmit" @reset="submitted = ''">
      <label data-slot="label">
        <Checkbox name="terms" value="yes" required>
          <CheckboxIndicator>
            <Check aria-hidden="true" />
          </CheckboxIndicator>
        </Checkbox>
        I agree to the terms
      </label>
      <div data-slot="row">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <label data-slot="label">
      <Checkbox :form="formId" name="newsletter" value="weekly" default-checked>
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Send me the weekly newsletter
    </label>
    <output data-slot="output">{{ submitted && `Submitted: ${submitted}` }}</output>
  </div>
</template>
