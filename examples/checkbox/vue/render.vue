<script setup lang="ts">
import { Check, Plus } from "@lucide/vue"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/vue/checkbox"

const topics = [
  { value: "design", label: "Design", checked: true },
  { value: "engineering", label: "Engineering", checked: false },
  { value: "marketing", label: "Marketing", checked: false },
  { value: "sales", label: "Sales", checked: false },
]
</script>

<template>
  <div data-slot="stack">
    <fieldset>
      <legend>Topics you follow</legend>
      <div data-slot="row">
        <Checkbox
          v-for="topic in topics"
          :key="topic.value"
          name="topics"
          :value="topic.value"
          :default-checked="topic.checked"
        >
          <template #render="{ props, state }">
            <button v-bind="props">
              <Check v-if="state.checked" />
              <Plus v-else />
              {{ topic.label }}
            </button>
          </template>
        </Checkbox>
      </div>
    </fieldset>
    <label data-slot="label">
      <Checkbox>
        <template #render="{ props }">
          <span v-bind="props">
            <CheckboxIndicator>
              <Check />
            </CheckboxIndicator>
          </span>
        </template>
      </Checkbox>
      Notify me about new topics
    </label>
  </div>
</template>
