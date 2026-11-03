<script setup lang="ts">
import type { ChangeDetails } from "@ui-sdk/core"
import {
  createOTPInputController,
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@ui-sdk/vue"
import { otpInputAction, otpInputFixture, otpInputOptions } from "tests/fixtures/otp-input.ts"
import { ref } from "vue"

const controller = createOTPInputController()
const { cancel, ...options } = otpInputOptions()
const { code, recovery, form } = otpInputFixture
const action = ref("")
const submitted = ref("")
// The first index of each group.
const starts = code.groups.map((_, group) => code.groups.slice(0, group).reduce((sum, size) => sum + size, 0))

function onValueChange(value: string, details: ChangeDetails) {
  if (cancel && value.includes(cancel)) return details.cancel()
  action.value = otpInputAction.change(value, details.reason)
}

function onValueCommit(value: string) {
  action.value = otpInputAction.complete(value)
}

function onSubmit(event: SubmitEvent) {
  submitted.value = String(new FormData(event.currentTarget as HTMLFormElement).get(code.name))
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form :aria-label="form.label" @submit.prevent="onSubmit">
      <OTPInput
        class="otp"
        :aria-label="code.label"
        :name="code.name"
        :max-length="code.length"
        :controller="controller"
        v-bind="options"
        @value-change="onValueChange"
        @value-commit="onValueCommit"
      >
        <template v-for="(size, group) in code.groups" :key="group">
          <OTPInputSeparator v-if="group > 0" class="otp-separator">-</OTPInputSeparator>
          <OTPInputGroup class="otp-group">
            <OTPInputSlot
              v-for="slot in size"
              :key="slot"
              :index="starts[group] + slot - 1"
              class="otp-slot"
            />
          </OTPInputGroup>
        </template>
      </OTPInput>
      <button type="submit">{{ form.submit }}</button>
      <button type="reset">{{ form.reset }}</button>
    </form>
    <OTPInput class="otp" :aria-label="recovery.label" :max-length="recovery.length" pattern="alphanumeric">
      <OTPInputGroup class="otp-group">
        <OTPInputSlot v-for="slot in recovery.length" :key="slot" :index="slot - 1" class="otp-slot" />
      </OTPInputGroup>
    </OTPInput>
    <button @click="controller.setValue(otpInputFixture.filled)">Fill code</button>
    <button @click="controller.clear()">Clear code</button>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
