<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
</script>

<template>
  <div data-slot="stack">
    <OTPInput disabled default-value="123456" aria-label="Disabled code">
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
    <OTPInput read-only default-value="654321" aria-label="Read-only code">
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
  </div>
</template>
