<script setup lang="ts">
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputClear,
  InputGroup,
  Textarea,
} from "@ui-sdk/vue"
import { ref } from "vue"

const renders = ref(0)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <FieldSet class="form">
      <FieldLegend>
        <template #render="{ props }">
          <div v-bind="props">Legend as a div</div>
        </template>
      </FieldLegend>
      <Field>
        <FieldLabel>Render function</FieldLabel>
        <Input class="input">
          <template #render="{ props, state }">
            <input
              v-bind="props"
              :data-state="state.filled ? 'filled' : 'empty'"
            />
          </template>
        </Input>
      </Field>
      <Field>
        <FieldLabel>Class from state</FieldLabel>
        <Textarea auto-resize class="textarea" />
      </Field>
      <InputGroup class="input-group">
        <Input class="input" aria-label="Search" />
        <InputClear role="button" tabindex="0" aria-label="Clear search">
          <template #render="{ props }">
            <span v-bind="props">×</span>
          </template>
        </InputClear>
      </InputGroup>
    </FieldSet>
    <button type="button" @click="renders++">
      Render again ({{ renders }})
    </button>
    <button>After</button>
  </div>
</template>
