import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
} from "@ui-sdk/solid/alert-dialog"
import { createSignal } from "solid-js"

function Example() {
  const confirm = createConfirm<{ name: string }>()
  const [result, setResult] = createSignal("")

  async function review() {
    setResult("")
    const acme = confirm({ name: "Acme" })
    const globex = confirm({ name: "Globex" })
    const [first, second] = await Promise.all([acme, globex])
    setResult(`Acme: ${first ? "confirmed" : "canceled"}. Globex: ${second ? "confirmed" : "canceled"}.`)
  }
  return (
    <div data-slot="stack">
      <button type="button" onClick={review}>
        Review two projects
      </button>
      <output data-slot="output" aria-live="polite">
        {result()}
      </output>
      <AlertDialog controller={confirm.controller}>
        <AlertDialogBackdrop />
        <AlertDialogContent<{
          name: string
        }>>
          {(state) => (
            <>
              <div data-slot="stack">
                <AlertDialogTitle>Archive {state.payload?.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Archived projects leave the active list. You can restore them later.
                </AlertDialogDescription>
              </div>
              <div data-slot="row">
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogClose data-variant="solid" value="confirm">
                  Archive
                </AlertDialogClose>
              </div>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { Example }
