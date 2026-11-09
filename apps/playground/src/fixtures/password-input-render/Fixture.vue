<script setup lang="ts">
import {
  PasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/vue"
import { ref } from "vue"

const action = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <PasswordInput
      class="password-input"
      @visible-change="(visible) => (action = `visible: ${visible}`)"
    >
      <PasswordInputControl class="input" aria-label="Password" />
      <PasswordInputToggle aria-label="Show password">
        <template #render="{ props, state }">
          <span
            v-bind="props"
            :class="[
              'password-toggle',
              state.visible ? 'is-visible' : 'is-hidden',
            ]"
          >
            <span aria-hidden="true">{{
              state.visible ? "Hide" : "Show"
            }}</span>
          </span>
        </template>
      </PasswordInputToggle>
    </PasswordInput>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
