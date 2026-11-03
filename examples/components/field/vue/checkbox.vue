<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
</script>

<template>
  <Field>
    <Checkbox name="usage">
      <CheckboxIndicator>
        <CheckIcon />
      </CheckboxIndicator>
    </Checkbox>
    <div data-slot="stack">
      <FieldLabel>Share usage data</FieldLabel>
      <FieldDescription>
        Help us improve by sending anonymous crash reports and usage statistics.
      </FieldDescription>
    </div>
  </Field>
</template>
