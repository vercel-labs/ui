<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <Checkbox default-checked disabled>
        <CheckboxIndicator>
          <CheckIcon aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Security alerts
    </label>
    <label data-slot="label">
      <Checkbox disabled>
        <CheckboxIndicator>
          <CheckIcon aria-hidden="true" />
        </CheckboxIndicator>
      </Checkbox>
      Enable notifications
    </label>
  </div>
</template>
