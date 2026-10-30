import { createConfirm, type ConfirmOptions } from "@ui-sdk/svelte/alert-dialog"
import { createDialogController } from "@ui-sdk/svelte/dialog"
import { createContext } from "svelte"

class Tracker {
  confirm = createConfirm<ConfirmOptions>()
  newIssue = createDialogController()
}

const [getTracker, setTracker] = createContext<Tracker>()

export { getTracker, setTracker, Tracker }
