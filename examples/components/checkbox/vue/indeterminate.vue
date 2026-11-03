<script setup lang="ts">
import { CheckIcon, MinusIcon } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
</script>

<template>
  <label data-slot="label">
    <Checkbox default-checked="indeterminate">
      <CheckboxIndicator v-slot="{ state }">
        <MinusIcon aria-hidden="true" v-if="state.indeterminate" />
        <CheckIcon aria-hidden="true" v-else />
      </CheckboxIndicator>
    </Checkbox>
    All notifications
  </label>
</template>
