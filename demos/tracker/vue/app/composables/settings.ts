function useSettings() {
  const { data } = useFetch("/api/settings", { key: "settings" })
  return data
}

async function saveSettings(form: FormData) {
  await $fetch("/api/settings", { method: "PUT", body: form })
  await refreshNuxtData("settings")
}

export { saveSettings, useSettings }
