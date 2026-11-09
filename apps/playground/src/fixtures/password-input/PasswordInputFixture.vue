<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createPasswordInputController,
  Field,
  FieldDescription,
  FieldLabel,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/vue"
import {
  passwordInputAction,
  passwordInputFixture,
  passwordInputOptions,
} from "tests/fixtures/password-input.ts"
import { ref } from "vue"

const { controlled, cancel, ...options } = passwordInputOptions()
const { form, email, password } = passwordInputFixture
const reveal = createPasswordInputController()
const action = ref("")
const visible = ref(!!options.defaultVisible)

function onVisibleChange(next: boolean, details: ChangeDetails) {
  if (cancel) {
    return details.cancel()
  }
  visible.value = next
  action.value = passwordInputAction.visible(next, details.reason)
}

function onSubmit(event: Event) {
  const field = (event.currentTarget as HTMLFormElement).elements.namedItem(
    password.name
  ) as HTMLInputElement
  action.value = passwordInputAction.submit(field.type)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form
      :aria-label="form.label"
      class="password-form"
      @submit.prevent="onSubmit"
    >
      <fieldset>
        <legend>{{ form.account }}</legend>
        <label>
          {{ email.label }}
          <input class="input" :name="email.name" :value="email.defaultValue" />
        </label>
        <Field>
          <FieldLabel>{{ password.label }}</FieldLabel>
          <PasswordInput
            class="password-input"
            :name="password.name"
            :controller="reveal"
            v-bind="options"
            :visible="controlled ? visible : undefined"
            :default-visible="controlled ? undefined : options.defaultVisible"
            @visible-change="onVisibleChange"
          >
            <PasswordInputControl class="input" />
            <PasswordInputToggle
              class="password-toggle"
              :aria-label="password.toggle"
            >
              <span aria-hidden="true">👁</span>
            </PasswordInputToggle>
          </PasswordInput>
          <FieldDescription>{{ password.description }}</FieldDescription>
        </Field>
        <p class="caps-lock">{{ password.capsLock }}</p>
      </fieldset>
      <button type="submit">{{ form.submit }}</button>
      <button type="reset">{{ form.reset }}</button>
    </form>
    <button @click="reveal.toggleVisible()">
      {{ passwordInputFixture.controller }}
    </button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
