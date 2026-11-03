<script setup lang="ts">
import { BellIcon } from "@lucide/vue"
import type { TogglePressedChangeReason } from "@ui-sdk/vue/toggle"
import { createToggleController, Toggle, ToggleIcon } from "@ui-sdk/vue/toggle"
import { ref } from "vue"

const notifications = createToggleController()
const pressed = ref(true)
const reason = ref("")

function onPressedChange(_pressed: boolean, details: { reason: TogglePressedChangeReason }) {
  reason.value = details.reason
}
</script>

<template>
  <div data-slot="stack">
    <Toggle v-model:pressed="pressed" :controller="notifications" @pressed-change="onPressedChange">
      <ToggleIcon data-variant="fill">
        <BellIcon />
      </ToggleIcon>
      Notifications
    </Toggle>
    <button type="button" @click="notifications.toggle()">Toggle from outside</button>
    <output data-slot="output"
      >Notifications: {{ pressed ? "on" : "off" }}{{ reason && `, last change: ${reason}` }}</output
    >
  </div>
</template>
