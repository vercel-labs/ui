<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
</script>

<template>
  <div dir="rtl" data-slot="stack">
    <span id="otp-rtl-label" data-slot="label">رمز التحقق</span>
    <OTPInput :max-length="6" aria-labelledby="otp-rtl-label">
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
  </div>
</template>
