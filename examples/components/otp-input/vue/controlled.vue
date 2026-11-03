<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { ref } from "vue"

const value = ref("")
</script>

<template>
  <div data-slot="stack">
    <label for="one-time-password" data-slot="label"> One-time password </label>
    <OTPInput id="one-time-password" v-model:value="value">
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
    <p data-slot="output">
      {{ value ? `You entered: ${value}` : "Enter your one-time password." }}
    </p>
  </div>
</template>
