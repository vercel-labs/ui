<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
</script>

<template>
  <OTPInput :max-length="4" text-align="center" aria-label="PIN">
    <OTPInputGroup>
      <OTPInputSlot v-for="index in 4" :key="index" :index="index - 1" />
    </OTPInputGroup>
  </OTPInput>
</template>
