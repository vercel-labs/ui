<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { ref } from "vue"

const methods = [
  { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
  { value: "express", label: "Express", detail: "$9, 2 days" },
  { value: "overnight", label: "Overnight", detail: "$24, next day" },
]

const submitted = ref("")

function submit(event: Event) {
  submitted.value = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement)))
}
import { useId } from "vue"

const id = useId()
</script>

<template>
  <div data-slot="stack">
    <RadioGroup
      aria-label="Shipping"
      name="shipping"
      :form="`${id}-shipping-form`"
      required
      default-value="standard"
    >
      <label data-slot="label" v-for="method in methods" :key="method.value">
        <Radio :value="method.value">
          <RadioIndicator />
        </Radio>
        {{ method.label }} <span data-slot="hint">{{ method.detail }}</span>
      </label>
    </RadioGroup>
    <form data-slot="row" :id="`${id}-shipping-form`" @submit.prevent="submit" @reset="submitted = ''">
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <output data-slot="output" v-if="submitted">Submitted: {{ submitted }}</output>
  </div>
</template>
