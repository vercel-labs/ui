<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { fieldRadiosFixture as f } from "tests/fixtures/field.ts"
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Field>
      <FieldLabel>{{ f.label }}</FieldLabel>
      <RadioGroup class="form" :name="f.name">
        <Field v-for="size in f.sizes" :key="size.value" class="row">
          <Radio class="radio" :value="size.value">
            <RadioIndicator class="radio-indicator" />
          </Radio>
          <FieldLabel>{{ size.label }}</FieldLabel>
        </Field>
      </RadioGroup>
    </Field>
    <button>After</button>
  </div>
</template>
