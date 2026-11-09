// Hooks every dialog fixture exposes to the specs: the dialog's controller,
// the confirm helper, and every open change the callbacks reported.
type Window = {
  dialog?: unknown
  confirmDelete?: unknown
  __openChanges?: string[]
}

function exposeDialogFixture(controller: unknown, confirm: unknown) {
  const target = window as unknown as Window
  target.dialog = controller
  target.confirmDelete = confirm
  target.__openChanges = []
}

// Records "dialog:false:escape-key".
function recordOpenChange(
  name: string,
  open: boolean,
  details: { reason: string }
) {
  ;((window as unknown as Window).__openChanges ??= []).push(
    `${name}:${open}:${details.reason}`
  )
}

export { exposeDialogFixture, recordOpenChange }
