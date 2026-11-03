<script setup lang="ts">
import { Button } from "@ui-sdk/vue/button"
import { ref } from "vue"

const submitted = ref<{ email: string; count: number }>()

function onSubmit(event: Event) {
  const email = String(new FormData(event.currentTarget as HTMLFormElement).get("email"))
  submitted.value = { email, count: (submitted.value?.count ?? 0) + 1 }
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="onSubmit" @reset="submitted = undefined">
    <label data-slot="label">
      Email
      <input name="email" type="email" value="ada@example.com" />
    </label>
    <div data-slot="row">
      <Button type="submit">Subscribe</Button>
      <Button type="reset">Reset</Button>
    </div>
    <output data-slot="output">{{
      submitted
        ? `Submitted: ${submitted.email} (${submitted.count} ${submitted.count === 1 ? "time" : "times"})`
        : ""
    }}</output>
  </form>
</template>
