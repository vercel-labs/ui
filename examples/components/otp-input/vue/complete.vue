<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { ref } from "vue"

const status = ref("")
</script>

<template>
  <div data-slot="stack">
    <OTPInput
      aria-label="Verification code"
      @value-change="status = ''"
      @value-commit="(value, details) => (status = `Checking ${value}, from ${details.reason}.`)"
    >
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
    <output data-slot="output">{{ status }}</output>
  </div>
</template>
