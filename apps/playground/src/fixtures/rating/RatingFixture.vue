<script setup lang="ts">
import { createRatingController, Rating, RatingItem } from "@ui-sdk/vue"
import { ratingOptions } from "tests/fixtures/page.ts"
import { ratingFixture } from "tests/fixtures/rating.ts"
import { ref } from "vue"

const { quality, value, average } = ratingFixture
const controller = createRatingController()
const { cancel, disabled } = ratingOptions()

const action = ref("")
const submitted = ref("")

function onValueChange(score: number | null, details: { reason: string; cancel: () => void }) {
  if (score === cancel) return details.cancel()
  action.value = `${score}:${details.reason}`
}

function onSubmit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  submitted.value = Array.from(new FormData(form), ([key, entry]) => `${key}=${entry}`).join("&")
}
</script>

<template>
  <form class="fixture" @submit.prevent="onSubmit">
    <button type="button">Before</button>
    <Rating
      :aria-label="quality.label"
      :name="quality.name"
      :default-value="quality.defaultValue"
      :disabled="disabled"
      :controller="controller"
      @value-change="onValueChange"
    >
      <RatingItem v-slot="{ state }">
        <span class="star">{{ state.fill }}</span>
      </RatingItem>
    </Rating>
    <button type="button">After</button>
    <Rating :aria-label="value.label" :name="value.name" :step="value.step" deselectable />
    <Rating :value="average.value" :get-value-label="average.getValueLabel" read-only />
    <button type="submit">Save</button>
    <button type="reset">Reset</button>
    <button type="button" @click="controller.setValue(5)">Rate five</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Submitted">{{ submitted }}</output>
  </form>
</template>
