<script setup lang="ts">
import { Field, FieldControl, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { ref } from "vue"

const limit = 280
const bio = ref("Designer and engineer. I build tools for people who make things on the web.")

function onInput(event: Event) {
  bio.value = (event.target as HTMLTextAreaElement).value
}
</script>

<template>
  <Field>
    <FieldLabel>Bio</FieldLabel>
    <FieldControl rows="4" name="bio" :maxlength="limit" :value="bio" @input="onInput">
      <template #render="{ props }">
        <textarea v-bind="props" />
      </template>
    </FieldControl>
    <FieldDescription>
      <span>Shown on your public profile.</span>
      <span> {{ bio.length }} / {{ limit }} </span>
    </FieldDescription>
  </Field>
</template>
