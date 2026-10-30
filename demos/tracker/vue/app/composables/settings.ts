import type { Settings } from "tracker-data"
import { refreshNuxtData, useFetch } from "#imports"

function useSettings() {
  return useFetch<Settings>("/api/settings", { key: "settings" })
}

async function saveSettings(form: FormData) {
  await $fetch("/api/settings", { method: "PUT", body: form })
  await refreshNuxtData("settings")
}

export { saveSettings, useSettings }
