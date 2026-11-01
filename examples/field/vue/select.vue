<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Customer support" },
]
</script>

<template>
  <Field>
    <FieldLabel>Department</FieldLabel>
    <FieldControl name="department">
      <template #render="{ props }">
        <select v-bind="props">
          <option value="" disabled selected>Choose department</option>
          <option v-for="department in departments" :key="department.value" :value="department.value">
            {{ department.label }}
          </option>
        </select>
      </template>
    </FieldControl>
    <FieldDescription> Select your department or area of work. </FieldDescription>
  </Field>
</template>
