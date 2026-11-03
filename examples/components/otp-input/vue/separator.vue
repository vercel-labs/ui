<script setup lang="ts">
import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { MinusIcon } from "@lucide/vue"
</script>

<template>
  <OTPInput :max-length="6" aria-label="Verification code">
    <OTPInputGroup>
      <OTPInputSlot :index="0" />
      <OTPInputSlot :index="1" />
    </OTPInputGroup>
    <OTPInputSeparator>
      <MinusIcon />
    </OTPInputSeparator>
    <OTPInputGroup>
      <OTPInputSlot :index="2" />
      <OTPInputSlot :index="3" />
    </OTPInputGroup>
    <OTPInputSeparator>
      <MinusIcon />
    </OTPInputSeparator>
    <OTPInputGroup>
      <OTPInputSlot :index="4" />
      <OTPInputSlot :index="5" />
    </OTPInputGroup>
  </OTPInput>
</template>
