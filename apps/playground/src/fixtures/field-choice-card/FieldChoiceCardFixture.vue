<script setup lang="ts">
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

const { alone } = fieldChoiceCardOptions()
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <FieldLabel v-for="card in f.cards" :key="card.name" class="choice-card">
      <Field>
        <Checkbox class="checkbox" :name="card.name">
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        <span>{{ card.title }}</span>
        <FieldDescription>{{ card.description }}</FieldDescription>
      </Field>
    </FieldLabel>
    <FieldLabel v-if="alone">{{ f.alone }}</FieldLabel>
    <button>After</button>
  </div>
</template>
