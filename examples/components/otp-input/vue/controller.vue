<script setup lang="ts">
import { createOTPInputController, OTPInput, OTPInputGroup, OTPInputSlot } from "@ui-sdk/vue/otp-input"
import { ref } from "vue"

const code = createOTPInputController()
const reading = ref("")
const read = () => (reading.value = `The code is "${code.getValue()}".`)
</script>

<template>
  <div data-slot="stack">
    <OTPInput :controller="code" aria-label="Verification code">
      <OTPInputGroup>
        <OTPInputSlot v-for="index in 6" :key="index" :index="index - 1" />
      </OTPInputGroup>
    </OTPInput>
    <div data-slot="row">
      <button type="button" @click="code.setValue('123456')">Fill</button>
      <button type="button" @click="code.clear()">Clear</button>
      <button type="button" @click="read">Read</button>
      <button type="button" @click="code.focus()">Focus</button>
    </div>
    <output data-slot="output">{{ reading }}</output>
  </div>
</template>
