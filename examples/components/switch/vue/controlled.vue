<script setup lang="ts">
import { createSwitchController, type SwitchCheckedChangeReason } from "@ui-sdk/core/switch"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { ref } from "vue"

const wifi = createSwitchController()
const checked = ref(true)
const reason = ref("")

function onCheckedChange(_checked: boolean, details: { reason: SwitchCheckedChangeReason }) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <Switch v-model:checked="checked" :controller="wifi" @checked-change="onCheckedChange">
        <SwitchThumb />
      </Switch>
      Wi-Fi
    </label>
    <button type="button" @click="wifi.toggle()">Toggle from outside</button>
    <output data-slot="output"
      >Wi-Fi: {{ checked ? "on" : "off" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
