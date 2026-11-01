<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import { Input, createInputController } from "@ui-sdk/vue/input"

const message = createInputController()
</script>

<template>
  <div data-slot="stack">
    <Field name="message">
      <FieldLabel> Message </FieldLabel>
      <Input :controller="message" placeholder="Say something" />
    </Field>
    <div data-slot="row">
      <button type="button" @click="message.setValue('On my way!')">Quick reply</button>
      <button type="button" @click="message.clear()">Clear</button>
      <button type="button" @click="message.focus()">Focus</button>
    </div>
  </div>
</template>
