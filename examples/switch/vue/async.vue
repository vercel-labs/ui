<script setup lang="ts">
import { LoaderCircle } from "@lucide/vue"
import { createSwitchController, type SwitchCheckedChangeReason } from "@ui-sdk/core/switch"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { ref } from "vue"

const save = (_checked: boolean) => new Promise((resolve) => setTimeout(resolve, 800))

const backups = createSwitchController()
const saving = ref(false)
const saved = ref(false)

function onCheckedChange(next: boolean, details: { reason: SwitchCheckedChangeReason; cancel: () => void }) {
  if (details.reason === "imperative") return
  details.cancel()
  if (saving.value) return
  saving.value = true
  saved.value = false
  save(next).then(() => {
    saving.value = false
    backups.setChecked(next, { reason: "imperative" })
    saved.value = true
  })
}
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <Switch :controller="backups" :aria-busy="saving" @checked-change="onCheckedChange">
        <SwitchThumb>
          <LoaderCircle aria-hidden="true" v-if="saving" />
        </SwitchThumb>
      </Switch>
      Automatic backups
    </label>
    <p data-slot="hint" role="status">
      {{ saving ? "Saving…" : saved ? "Saved" : "" }}
    </p>
  </div>
</template>
