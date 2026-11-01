<script setup lang="ts">
import { Check, Minus } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
</script>

<template>
  <label data-slot="label">
    <Checkbox default-checked="indeterminate">
      <CheckboxIndicator v-slot="{ state }">
        <Minus aria-hidden="true" v-if="state.indeterminate" />
        <Check aria-hidden="true" v-else />
      </CheckboxIndicator>
    </Checkbox>
    All notifications
  </label>
</template>
