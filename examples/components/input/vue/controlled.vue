<script setup lang="ts">
import type { InputValueChangeReason } from "@ui-sdk/core/input"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
import { ref } from "vue"

const name = ref("Ada")
const reason = ref<InputValueChangeReason>()
</script>

<template>
  <div data-slot="stack">
    <Field>
      <FieldLabel> Display name </FieldLabel>
      <Input
        v-model:value="name"
        @value-change="(_: string, details: { reason: InputValueChangeReason }) => (reason = details.reason)"
      />
      <FieldDescription>
        {{ reason ? `Changed by ${reason}.` : "Type to change it." }}
      </FieldDescription>
    </Field>
    <Field>
      <FieldLabel> Profile URL </FieldLabel>
      <Input read-only :value="`example.com/${name.toLowerCase()}`" />
    </Field>
  </div>
</template>
