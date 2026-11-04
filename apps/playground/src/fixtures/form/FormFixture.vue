<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputClear,
  InputGroup,
  Textarea,
} from "@ui-sdk/vue"
import type { InputValueChangeReason } from "@ui-sdk/core/input"
import type { ChangeDetails } from "@ui-sdk/core"
import {
  formFixture as f,
  formOptions,
  invalidOf,
  messageOf,
  save,
  serializeData,
  without,
  type FormErrors,
} from "tests/fixtures/form.ts"
import { ref } from "vue"

const options = formOptions()
const errors = ref<FormErrors | undefined>(options.errors)
const action = ref("")
const submitted = ref("")
const username = ref("")
const contactDisabled = ref(false)

let pending = false

async function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  if (pending) return
  const data = new FormData(event.currentTarget as HTMLFormElement)
  pending = true
  try {
    const result = await save(data, options.action)
    errors.value = result
    if (!result) submitted.value = serializeData(data)
  } catch {
    // The fake server failed. The page keeps what it showed.
  } finally {
    pending = false
  }
}

function onUsername(value: string, details: ChangeDetails<InputValueChangeReason>) {
  if (options.noDigits && /\d/.test(value)) return details.cancel()
  action.value = `${f.username.name}:${value}:${details.reason}`
  username.value = value
  errors.value = without(errors.value, f.username.name)
}

function onWebsite(value: string, details: ChangeDetails<InputValueChangeReason>) {
  action.value = `${f.website.name}:${value}:${details.reason}`
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form class="form" :aria-label="f.formLabel" @submit="onSubmit" @reset="errors = undefined">
      <FieldSet class="form" :disabled="options.disabled || undefined">
        <FieldLegend>{{ f.profile.legend }}</FieldLegend>
        <FieldDescription>{{ f.profile.description }}</FieldDescription>
        <Field :name="f.username.name" :invalid="invalidOf(errors, f.username.name)">
          <FieldLabel class="label">{{ f.username.label }}</FieldLabel>
          <Input
            class="input"
            required
            :minlength="3"
            :value="options.controlled ? username : undefined"
            @value-change="onUsername"
          />
          <FieldDescription>{{ f.username.description }}</FieldDescription>
          <FieldError v-slot="{ state }" class="field-error">
            {{ messageOf(errors, f.username.name) || state.message }}
          </FieldError>
        </Field>
        <Field :name="f.bio.name" :invalid="invalidOf(errors, f.bio.name)">
          <FieldLabel class="label">{{ f.bio.label }}</FieldLabel>
          <Textarea class="textarea" auto-resize :submit-shortcut="options.submitShortcut" />
          <FieldDescription>{{ f.bio.description }}</FieldDescription>
          <FieldError v-slot="{ state }" class="field-error">
            {{ messageOf(errors, f.bio.name) || state.message }}
          </FieldError>
        </Field>
      </FieldSet>
      <FieldSet class="form" :disabled="contactDisabled || undefined">
        <FieldLegend>{{ f.contact.legend }}</FieldLegend>
        <Field :name="f.email.name" :invalid="invalidOf(errors, f.email.name)">
          <FieldLabel class="label">{{ f.email.label }}</FieldLabel>
          <Input
            class="input"
            type="email"
            :default-value="f.email.defaultValue"
            @value-change="errors = without(errors, f.email.name)"
          />
          <FieldError v-slot="{ state }" class="field-error">
            {{ messageOf(errors, f.email.name) || state.message }}
          </FieldError>
        </Field>
        <Field :name="f.website.name">
          <FieldLabel class="label">{{ f.website.label }}</FieldLabel>
          <InputGroup class="input-group">
            <span>{{ f.website.prefix }}</span>
            <Input class="input" @value-change="onWebsite" />
            <InputClear :aria-label="f.website.clear">×</InputClear>
          </InputGroup>
        </Field>
      </FieldSet>
      <div class="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <button type="button" @click="contactDisabled = !contactDisabled">Toggle contact</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
