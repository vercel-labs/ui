<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { MinusIcon } from "@lucide/vue"
</script>

<template>
  <OTPInput :max-length="8" pattern="alphanumeric" aria-label="Recovery code">
    <OTPInputGroup>
      <OTPInputSlot v-for="index in 4" :key="index" :index="index - 1" />
    </OTPInputGroup>
    <OTPInputSeparator>
      <MinusIcon aria-hidden="true" />
    </OTPInputSeparator>
    <OTPInputGroup>
      <OTPInputSlot v-for="index in 4" :key="index" :index="index + 3" />
    </OTPInputGroup>
  </OTPInput>
</template>
