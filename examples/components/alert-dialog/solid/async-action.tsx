import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/solid/alert-dialog"
import { createSignal } from "solid-js"

function Example() {
  let attempts = 0
  const [status, setStatus] = createSignal("")

  async function deleteProject() {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (attempts++ === 0) throw new Error("Couldn't delete the project. Try again.")
  }

  function onOpenChange(open: boolean, details: { reason: string }) {
    if (open) setStatus("")
    else if (details.reason === "action") setStatus("Deleted")
  }
  return (
    <div data-slot="stack">
      <AlertDialog pendingAnnouncement="Deleting project" onOpenChange={onOpenChange}>
        <AlertDialogTrigger>Delete project</AlertDialogTrigger>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <div data-slot="stack">
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the project and its files.
            </AlertDialogDescription>
          </div>
          <AlertDialogClose
            data-variant="solid"
            value="confirm"
            action={deleteProject}
            render={(props, state) => (
              <div data-slot="stack">
                <div data-slot="row">
                  <AlertDialogClose>Cancel</AlertDialogClose>
                  <button {...props}>
                    {state.pending ? "Deleting…" : state.error ? "Try again" : "Delete"}
                  </button>
                </div>
                <p data-slot="hint" role="alert">
                  {state.error instanceof Error ? state.error.message : ""}
                </p>
              </div>
            )}
          />
        </AlertDialogContent>
      </AlertDialog>
      <output data-slot="output" aria-live="polite">
        {status()}
      </output>
    </div>
  )
}

export { Example }
