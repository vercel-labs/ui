<script setup lang="ts">
import {
  Checkbox,
  CheckboxIndicator,
  Field,
  FieldControl,
  FieldLabel,
  Radio,
  RadioGroup,
  Switch,
  SwitchThumb,
} from "@ui-sdk/vue"
import { ref } from "vue"

const action = ref("")
const nickname = ref("")

function onNickname(event: Event) {
  nickname.value = (event.target as HTMLInputElement).value
}

function onSpan(checked: unknown) {
  action.value = `span:${String(checked)}`
}

function onSize(value: string | null) {
  action.value = `size:${value}`
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form class="form" aria-label="Rendering" @submit.prevent>
      <label>
        <Checkbox class="checkbox" @checked-change="onSpan">
          <template #render="{ props }">
            <span v-bind="props">
              <CheckboxIndicator class="checkbox-indicator" />
            </span>
          </template>
        </Checkbox>
        Rendered as a span
      </label>
      <Checkbox aria-label="Render function">
        <template #render="{ props, state }">
          <button v-bind="props">{{ state.checked ? "On" : "Off" }}</button>
        </template>
      </Checkbox>
      <Checkbox aria-label="Class from state" v-slot="{ state }">
        <span hidden :data-class="state.checked" />
      </Checkbox>
      <label>
        <Switch class="switch" default-checked>
          <SwitchThumb v-slot="{ state }">{{
            state.checked ? "I" : "O"
          }}</SwitchThumb>
        </Switch>
        Labelled thumb
      </label>
      <RadioGroup
        aria-label="Size"
        default-value="small"
        @value-change="onSize"
      >
        <label v-for="value in ['small', 'large']" :key="value">
          <Radio class="radio" :value="value">
            <template #render="{ props }">
              <span v-bind="props" />
            </template>
          </Radio>
          {{ value === "small" ? "Small" : "Large" }}
        </label>
      </RadioGroup>
      <Field>
        <FieldLabel>Nickname</FieldLabel>
        <FieldControl :value="nickname" @input="onNickname" />
      </Field>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
