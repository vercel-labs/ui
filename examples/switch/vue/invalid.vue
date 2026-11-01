<script setup lang="ts">
import { Field, FieldError, FieldLabel } from "@ui-sdk/vue/field"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { ref } from "vue"

const submitted = ref(false)
</script>

<template>
  <form data-slot="stack" @submit.prevent="submitted = true">
    <Field>
      <div data-slot="row">
        <Switch name="terms" required @checked-change="submitted = false">
          <SwitchThumb />
        </Switch>
        <FieldLabel>I agree to the terms</FieldLabel>
      </div>
      <div>
        <FieldError match="valueMissing"> You must agree to the terms to continue. </FieldError>
      </div>
    </Field>
    <button type="submit">Continue</button>
    <output data-slot="output">{{ submitted ? "Thanks, you're all set." : "" }}</output>
  </form>
</template>
