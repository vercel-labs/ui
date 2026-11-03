<script setup lang="ts">
import {
  Avatar,
  AvatarFallback,
  OTPInput,
  OTPInputSlot,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  ProgressValue,
} from "@ui-sdk/vue"
import { ref } from "vue"

const value = ref(40)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Progress
      :value="value"
      aria-label="Export"
      :class="`gauge is-${value >= 100 ? 'complete' : 'progressing'}`"
    >
      <template #render="{ props, state }">
        <section v-bind="props">
          <ProgressValue v-slot="{ state: valueState }">{{ valueState.percent }}% done</ProgressValue>
          <ProgressTrack class="gauge-track"
            ><ProgressIndicator class="gauge-indicator" :data-status="state.status"
          /></ProgressTrack>
        </section>
      </template>
    </Progress>
    <Avatar class="avatar">
      <template #render="{ props }">
        <div v-bind="props">
          <AvatarFallback class="avatar-fallback" v-slot="{ state }">
            <span :class="`is-${state.loadingStatus}`">RF</span>
          </AvatarFallback>
        </div>
      </template>
    </Avatar>
    <OTPInput aria-label="PIN" :max-length="4" class="otp">
      <template #render="{ props, children }">
        <section v-bind="props"><component :is="children" /></section>
      </template>
      <OTPInputSlot v-for="index in 4" :key="index" :index="index - 1" v-slot="{ state }" class="otp-slot">
        <span :class="{ 'is-active': state.active }">{{ state.char ?? "·" }}</span>
      </OTPInputSlot>
    </OTPInput>
    <button @click="value = 100">Finish</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
  </div>
</template>
