async function saveSettings(form: FormData) {
  await $fetch("/api/settings", { method: "PUT", body: form })
  await refreshNuxtData()
}

export { saveSettings }
