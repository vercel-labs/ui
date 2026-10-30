import { type ConfirmOptions, createConfirm } from "@ui-sdk/vue/alert-dialog"
import { createDialogController } from "@ui-sdk/vue/dialog"
import { inject, type InjectionKey, provide } from "vue"

function createTracker() {
  return {
    confirm: createConfirm<ConfirmOptions>(),
    newIssue: createDialogController(),
  }
}

type Tracker = ReturnType<typeof createTracker>

const key: InjectionKey<Tracker> = Symbol("tracker")

function provideTracker() {
  const tracker = createTracker()
  provide(key, tracker)
  return tracker
}

function useTracker() {
  const tracker = inject(key)
  if (!tracker) throw new Error("useTracker() needs provideTracker() in app.vue.")
  return tracker
}

export { provideTracker, useTracker }
