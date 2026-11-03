<script setup lang="ts">
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { ref } from "vue"

const submitted = ref("")

function onSubmit(event: Event) {
  const data = [...new FormData(event.currentTarget as HTMLFormElement)].map(
    ([name, value]) => `${name}=${value}`,
  )
  submitted.value = data.join(", ") || "nothing"
}
</script>

<template>
  <div data-slot="stack">
    <form data-slot="stack" id="email-preferences" @submit.prevent="onSubmit" @reset="submitted = ''">
      <fieldset data-slot="stack">
        <legend>Email notifications</legend>
        <label data-slot="label">
          Marketing emails
          <Switch name="marketing">
            <SwitchThumb />
          </Switch>
        </label>
        <label data-slot="label">
          Security alerts
          <Switch name="security" default-checked>
            <SwitchThumb />
          </Switch>
        </label>
        <label data-slot="label">
          Weekly digest
          <Switch name="digest" value="weekly" default-checked>
            <SwitchThumb />
          </Switch>
        </label>
      </fieldset>
      <div data-slot="row">
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
    <div>
      <label data-slot="label">
        Join the beta
        <Switch name="beta" form="email-preferences">
          <SwitchThumb />
        </Switch>
      </label>
    </div>
    <output data-slot="output">{{ submitted ? `Submitted: ${submitted}` : "" }}</output>
  </div>
</template>
