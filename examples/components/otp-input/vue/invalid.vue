<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
</script>

<template>
  <div data-slot="stack">
    <OTPInput
      default-value="000000"
      aria-label="Verification code"
      aria-invalid="true"
      aria-describedby="otp-error"
    >
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
    <p id="otp-error">That code didn't work. Check it and try again.</p>
  </div>
</template>
