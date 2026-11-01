<script setup lang="ts">
import { Check } from "@lucide/vue"
import { createCheckboxController, type CheckedState } from "@ui-sdk/core/checkbox"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { ref } from "vue"

const updates = createCheckboxController()
const checked = ref<CheckedState>(false)
const reason = ref("")

function onCheckedChange(_: CheckedState, details: { reason: string }) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <Checkbox v-model:checked="checked" :controller="updates" @checked-change="onCheckedChange">
        <CheckboxIndicator>
          <Check aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Email me about product updates
    </label>
    <button type="button" @click="updates.toggle()">Toggle from outside</button>
    <output data-slot="output"
      >Checked: {{ String(checked) }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
