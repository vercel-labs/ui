<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
  NumberInput,
  NumberInputDecrement,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInputControl,
  NumberInputScrubArea,
} from "@ui-sdk/vue"
import {
  numberInputFixture as f,
  numberInputOptions,
  serialize,
} from "tests/fixtures/number-input.ts"
import { ref } from "vue"

const options = numberInputOptions()
const action = ref("")
const commits = ref<string[]>([])
const submitted = ref("")
const quantity = ref<number | null>(options.quantity)
const shared = {
  wheel: options.wheel,
  disabled: options.disabled,
  readOnly: options.readOnly,
  locale: options.locale,
}
const currency = { style: "currency" as const, currency: f.amount.currency }

// Records a change, or cancels it when the URL asks.
function report(
  name: string,
  value: number | null,
  details: { cancel: () => void }
) {
  if (options.cancel === name) {
    return details.cancel()
  }
  action.value = `${name}:${String(value)}`
}

function commit(name: string, value: number | null) {
  commits.value = [...commits.value, `${name}:${String(value)}`]
}

function onQuantity(value: number | null, details: { cancel: () => void }) {
  report(f.quantity.name, value, details)
}

function onAmount(value: number | null, details: { cancel: () => void }) {
  report(f.amount.name, value, details)
}

function onQuantityCommit(value: number | null) {
  commit(f.quantity.name, value)
}

function onAmountCommit(value: number | null) {
  commit(f.amount.name, value)
}

function onSubmit(event: Event) {
  submitted.value = serialize(event.currentTarget as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form class="form" :aria-label="f.formLabel" @submit.prevent="onSubmit">
      <!-- The field names the quantity, so the field's name reaches the form. -->
      <Field :name="f.quantity.name">
        <FieldLabel>{{ f.quantity.label }}</FieldLabel>
        <NumberInput
          v-bind="shared"
          :min="f.quantity.min"
          :max="f.quantity.max"
          :required="options.required"
          :value="options.controlled ? quantity : undefined"
          :default-value="options.controlled ? undefined : options.quantity"
          @value-change="onQuantity"
          @update:value="(next) => (quantity = next)"
          @value-commit="onQuantityCommit"
        >
          <NumberInputGroup class="number-input-group">
            <NumberInputDecrement :aria-label="f.quantity.decrement"
              >−</NumberInputDecrement
            >
            <NumberInputControl class="number-input-control" />
            <NumberInputIncrement
              :aria-label="f.quantity.increment"
              :disabled="options.disabledIncrement"
              >+</NumberInputIncrement
            >
          </NumberInputGroup>
        </NumberInput>
        <FieldDescription>{{ f.quantity.description }}</FieldDescription>
      </Field>

      <Field>
        <FieldLabel>{{ f.amount.label }}</FieldLabel>
        <NumberInput
          v-bind="shared"
          :name="f.amount.name"
          :default-value="f.amount.defaultValue"
          :min="options.amountMin"
          :step="f.amount.step"
          :format="currency"
          @value-change="onAmount"
          @value-commit="onAmountCommit"
        >
          <NumberInputScrubArea class="number-input-scrub">{{
            f.amount.scrub
          }}</NumberInputScrubArea>
          <NumberInputGroup class="number-input-group">
            <NumberInputDecrement :aria-label="f.amount.decrement"
              >−</NumberInputDecrement
            >
            <NumberInputControl class="number-input-control" />
            <NumberInputIncrement :aria-label="f.amount.increment"
              >+</NumberInputIncrement
            >
          </NumberInputGroup>
        </NumberInput>
      </Field>

      <div class="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Committed">{{
      commits.join(" ")
    }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
