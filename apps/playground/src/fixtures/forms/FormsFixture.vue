<script setup lang="ts">
import type { CheckedState } from "@ui-sdk/core/checkbox"
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  Radio,
  RadioGroup,
  RadioIndicator,
  Switch,
  SwitchThumb,
} from "@ui-sdk/vue"
import {
  formsFixture as f,
  formsOptions,
  serialize,
} from "tests/fixtures/forms.ts"
import { ref } from "vue"

const options = formsOptions()
const action = ref("")
const source = ref("")
const submitted = ref("")
const terms = ref<CheckedState>(false)
const shipping = ref(false)
const all = f.toppings.items.map((item) => item.value)

// Records a change, or cancels it when the URL asks.
function report(
  name: string,
  value: unknown,
  details: { cancel: () => void; source: string }
) {
  if (options.cancel === name) {
    return details.cancel()
  }
  action.value = `${name}:${String(value)}`
  source.value = details.source
}

function onTerms(
  checked: CheckedState,
  details: { cancel: () => void; canceled: boolean; source: string }
) {
  report(f.terms.name, checked, details)
  if (!details.canceled) {
    terms.value = checked
  }
}

function onToppings(
  value: string[],
  details: { cancel: () => void; source: string }
) {
  report(f.toppings.name, value.join(","), details)
}

function onPlan(
  value: string | null,
  details: { cancel: () => void; source: string }
) {
  report(f.plan.name, value, details)
}

function onSubmit(event: Event) {
  submitted.value = serialize(event.currentTarget as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form
      class="form"
      :id="f.formId"
      :aria-label="f.formLabel"
      @submit.prevent="onSubmit"
    >
      <Field>
        <div class="row">
          <Checkbox
            class="checkbox"
            :name="f.terms.name"
            :value="f.terms.value"
            required
            :read-only="options.readOnly"
            :checked="options.controlled ? terms : undefined"
            @checked-change="onTerms"
          >
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
          <FieldLabel>{{ f.terms.label }}</FieldLabel>
        </div>
        <FieldDescription>{{ f.terms.description }}</FieldDescription>
        <FieldError class="field-error" match="valueMissing">{{
          f.terms.error
        }}</FieldError>
      </Field>

      <fieldset>
        <legend :id="f.toppings.legendId">{{ f.toppings.legend }}</legend>
        <CheckboxGroup
          class="form"
          :aria-labelledby="f.toppings.legendId"
          :name="f.toppings.name"
          :default-value="f.toppings.defaultValue"
          :all-values="all"
          :required="options.toppingsRequired"
          @value-change="onToppings"
        >
          <label>
            <Checkbox class="checkbox" parent>
              <CheckboxIndicator class="checkbox-indicator" />
            </Checkbox>
            {{ f.toppings.parent }}
          </label>
          <label v-for="item in f.toppings.items" :key="item.value">
            <Checkbox class="checkbox" :value="item.value">
              <CheckboxIndicator class="checkbox-indicator" />
            </Checkbox>
            {{ item.label }}
          </label>
        </CheckboxGroup>
      </fieldset>

      <label v-for="item in f.switches" :key="item.name">
        <Switch
          class="switch"
          :name="item.name"
          :default-checked="item.defaultChecked"
          @checked-change="
            (checked: boolean, details: any) =>
              report(item.name, checked, details)
          "
        >
          <SwitchThumb class="switch-thumb" />
        </Switch>
        {{ item.label }}
      </label>

      <Field>
        <FieldLabel>{{ f.plan.label }}</FieldLabel>
        <RadioGroup
          class="form"
          :name="f.plan.name"
          required
          :default-value="options.plan"
          :read-only="options.readOnly"
          :disabled="options.disabled"
          :loop="options.loop"
          @value-change="onPlan"
        >
          <label v-for="item in f.plan.items" :key="item.value">
            <Radio class="radio" :value="item.value" :disabled="item.disabled">
              <RadioIndicator class="radio-indicator" />
            </Radio>
            {{ item.label }}
          </label>
        </RadioGroup>
        <FieldDescription>{{ f.plan.description }}</FieldDescription>
        <FieldError class="field-error" />
      </Field>

      <Field :invalid="options.invalid">
        <FieldLabel>{{ f.email.label }}</FieldLabel>
        <FieldControl type="email" :name="f.email.name" required />
        <FieldDescription>{{ f.email.description }}</FieldDescription>
        <FieldError class="field-error" />
      </Field>

      <Field v-if="options.nickname">
        <FieldLabel>{{ f.nickname.label }}</FieldLabel>
        <FieldControl :name="f.nickname.name" required />
      </Field>

      <fieldset :disabled="shipping">
        <legend>{{ f.shipping.legend }}</legend>
        <label>
          <Checkbox class="checkbox" :name="f.shipping.name">
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
          {{ f.shipping.label }}
        </label>
      </fieldset>

      <div class="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <label>
      <Checkbox
        class="checkbox"
        :form="f.formId"
        :name="f.newsletter.name"
        :value="f.newsletter.value"
      >
        <CheckboxIndicator class="checkbox-indicator" />
      </Checkbox>
      {{ f.newsletter.label }}
    </label>
    <button type="button" @click="shipping = !shipping">Toggle shipping</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Last source">{{ source }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
