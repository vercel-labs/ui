<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
</script>

<template>
  <OTPInput :max-length="6" :pattern="/[0-9A-F]/i" input-mode="text" aria-label="Device code">
    <OTPInputGroup>
      <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
    </OTPInputGroup>
  </OTPInput>
</template>
