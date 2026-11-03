<script setup lang="ts">
import { EyeIcon, EyeOffIcon } from "@lucide/vue"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "@ui-sdk/vue/password-input"
import { ref } from "vue"

const submitted = ref("")

function onSubmit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  const length = String(data.get("password")).length
  submitted.value = `Signed in as ${data.get("email")}, with a password of ${length} characters.`
}
</script>

<template>
  <div data-slot="stack">
    <form data-slot="stack" id="sign-in" @submit.prevent="onSubmit" @reset="submitted = ''">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" required autocomplete="username" />
      </Field>
    </form>
    <Field>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput name="password" form="sign-in" required>
        <PasswordInputControl />
        <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
          <EyeOffIcon aria-hidden="true" v-if="state.visible" />
          <EyeIcon aria-hidden="true" v-else />
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
    <div data-slot="row">
      <button type="submit" form="sign-in">Sign in</button>
      <button type="reset" form="sign-in">Reset</button>
    </div>
    <output data-slot="output">{{ submitted }}</output>
  </div>
</template>
