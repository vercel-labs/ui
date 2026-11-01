<script setup lang="ts">
import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/vue/radio"
import { useId } from "vue"

const id = useId()
</script>

<template>
  <div data-slot="row">
    <div data-slot="stack">
      <span data-slot="hint" :id="`${id}-theme-heading`">Theme</span>
      <RadioGroup default-value="light" disabled :aria-labelledby="`${id}-theme-heading`">
        <label data-slot="label">
          <Radio value="light">
            <RadioIndicator />
          </Radio>
          Light
        </label>
        <label data-slot="label">
          <Radio value="dark">
            <RadioIndicator />
          </Radio>
          Dark
        </label>
        <label data-slot="label">
          <Radio value="system">
            <RadioIndicator />
          </Radio>
          System
        </label>
      </RadioGroup>
    </div>
    <div data-slot="stack">
      <span data-slot="hint" :id="`${id}-notify-heading`">Notify me about</span>
      <RadioGroup default-value="all" :aria-labelledby="`${id}-notify-heading`">
        <label data-slot="label">
          <Radio value="all">
            <RadioIndicator />
          </Radio>
          All
        </label>
        <label data-slot="label">
          <Radio value="mentions" disabled>
            <RadioIndicator />
          </Radio>
          Mentions
        </label>
        <label data-slot="label">
          <Radio value="nothing">
            <RadioIndicator />
          </Radio>
          Nothing
        </label>
      </RadioGroup>
    </div>
  </div>
</template>
