<script setup lang="ts">
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { onMounted, onUnmounted, ref } from "vue"
import {
  fieldChoiceCardFixture as f,
  fieldChoiceCardOptions,
} from "tests/fixtures/field.ts"

const { alone, later } = fieldChoiceCardOptions()
const ready = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  timer = setTimeout(() => (ready.value = true), f.later.delay)
})
onUnmounted(() => clearTimeout(timer))
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
    <FieldLabel v-if="later" class="choice-card">
      <Field>
        <Checkbox v-if="ready" class="checkbox" :name="f.later.name">
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        <span>{{ f.later.title }}</span>
        <FieldDescription>{{ f.later.description }}</FieldDescription>
      </Field>
    </FieldLabel>
    <FieldLabel v-if="alone">{{ f.alone }}</FieldLabel>
    <button>After</button>
  </div>
</template>
