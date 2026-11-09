// Hooks the dialog patterns fixtures share with the specs.
type Window = {
  __openChanges?: string[]
  __action?: { resolve: () => void; reject: (message: string) => void }
}

const target = window as unknown as Window
target.__openChanges = []

// The share popover renders into this container, and popups inside it follow.
if (!document.getElementById("popover-root")) {
  const root = document.createElement("div")
  root.id = "popover-root"
  document.body.append(root)
}

// Records "rename:false:escape-key".
function recordOpenChange(
  name: string,
  open: boolean,
  details: { reason: string }
) {
  target.__openChanges!.push(`${name}:${open}:${details.reason}`)
}

// The delete action. It stays pending until a spec calls
// `__action.resolve()` or `__action.reject("Offline")`.
function pendingAction() {
  return new Promise<void>((resolve, reject) => {
    target.__action = {
      resolve,
      reject: (message) => reject(new Error(message)),
    }
  })
}

export { pendingAction, recordOpenChange }
