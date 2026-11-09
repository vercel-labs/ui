<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { ref } from "vue"
import {
  fieldRadiosFixture as f,
  fieldRadiosOptions,
} from "tests/fixtures/field.ts"

const { disabledField } = fieldRadiosOptions()
const firstDisabled = ref(false)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Field>
      <FieldLabel>{{ f.label }}</FieldLabel>
      <RadioGroup class="form" :name="f.name">
        <Field
          v-for="(size, index) in f.sizes"
          :key="size.value"
          class="row"
          :disabled="index === 0 && disabledField"
        >
          <Radio
            class="radio"
            :value="size.value"
            :disabled="index === 0 && firstDisabled"
          >
            <RadioIndicator class="radio-indicator" />
          </Radio>
          <FieldLabel>{{ size.label }}</FieldLabel>
        </Field>
      </RadioGroup>
    </Field>
    <button>After</button>
    <button @click="firstDisabled = !firstDisabled">
      {{ f.disableFirst }}
    </button>
  </div>
</template>
