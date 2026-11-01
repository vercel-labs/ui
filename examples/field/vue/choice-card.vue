<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"

const environments = [
  { value: "kubernetes", title: "Kubernetes", description: "Run GPU workloads on a K8s configured cluster." },
  {
    value: "vm",
    title: "Virtual machine",
    description: "Access a VM configured cluster to run GPU workloads.",
  },
]
</script>

<template>
  <Field>
    <FieldLabel>Compute environment</FieldLabel>
    <FieldDescription> Select the compute environment for your cluster. </FieldDescription>
    <RadioGroup name="environment" default-value="kubernetes">
      <label data-slot="card" v-for="environment in environments" :key="environment.value">
        <span data-slot="stack">
          <span>{{ environment.title }}</span>
          <span data-slot="hint">{{ environment.description }}</span>
        </span>
        <Radio :value="environment.value">
          <RadioIndicator />
        </Radio>
      </label>
    </RadioGroup>
  </Field>
</template>
