<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue"
import {
  createPasswordInputController,
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/vue/password-input"
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const password = createPasswordInputController()
const reading = ref("")

function suggest() {
  password.setValue("plum-kettle-orbit-42")
  password.setVisible(true)
}

function read() {
  reading.value = `${password.getValue().length} characters, ${password.isVisible() ? "shown" : "hidden"}.`
}
</script>

<template>
  <div data-slot="stack">
    <Field name="new-password">
      <FieldLabel>New password</FieldLabel>
      <PasswordInput :controller="password" auto-complete="new-password">
        <PasswordInputControl />
        <PasswordInputToggle v-slot="{ state }" aria-label="Show password">
          <EyeOff aria-hidden="true" v-if="state.visible" />
          <Eye aria-hidden="true" v-else />
        </PasswordInputToggle>
      </PasswordInput>
    </Field>
    <div data-slot="row">
      <button type="button" @click="suggest">Suggest</button>
      <button type="button" @click="password.toggleVisible()">Toggle</button>
      <button type="button" @click="password.clear()">Clear</button>
      <button type="button" @click="read">Read</button>
      <button type="button" @click="password.focus()">Focus</button>
    </div>
    <output data-slot="output">{{ reading }}</output>
  </div>
</template>
