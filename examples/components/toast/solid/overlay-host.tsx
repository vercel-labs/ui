import { onCleanup } from "solid-js"
import { OverlayHost, createOverlays } from "@ui-sdk/solid/overlays"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
  type ConfirmOptions,
} from "@ui-sdk/solid/alert-dialog"
import { Toast, ToastDescription, ToastTitle, createToaster } from "@ui-sdk/solid/toast"
import { createSignal, For } from "solid-js"

export function Example() {
  const overlays = createOverlays()
  const toast = createToaster({ overlays })
  const confirm = createConfirm({ overlays })
  onCleanup(() => {
    toast.dismiss()
  })

  const [projects, setProjects] = createSignal(["Acme", "Globex"])
  async function remove(name: string, button: HTMLElement) {
    const yes = await confirm({
      title: `Delete ${name}?`,
      description: "This permanently deletes the project and its files.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
    })
    if (!yes) return
    const row = button.closest("li")!
    ;(row.nextElementSibling ?? row.previousElementSibling)?.querySelector("button")?.focus()
    setProjects((list) => list.filter((project) => project !== name))
    toast.success(`${name} deleted`, { priority: "assertive" })
  }
  return (
    <>
      <ul data-slot="list">
        <For each={projects()}>
          {(name) => (
            <li data-slot="row">
              {name}
              <button data-variant="secondary" onClick={(event) => remove(name, event.currentTarget)}>
                Delete
              </button>
            </li>
          )}
        </For>
      </ul>
      <OverlayHost
        overlays={overlays}
        toast={{
          children: () => (
            <Toast>
              <div data-slot="stack">
                <ToastTitle />
                <ToastDescription />
              </div>
            </Toast>
          ),
        }}
      />
      <AlertDialog controller={confirm.controller}>
        <AlertDialogContent<ConfirmOptions>>
          {(state) => {
            const question = () => state.payload
            return (
              <>
                <AlertDialogTitle>{question()?.title}</AlertDialogTitle>
                <AlertDialogDescription>{question()?.description}</AlertDialogDescription>
                <div data-slot="row">
                  <AlertDialogClose data-variant="secondary">{question()?.cancelLabel}</AlertDialogClose>
                  <AlertDialogClose data-variant="secondary" value="confirm">
                    {question()?.confirmLabel}
                  </AlertDialogClose>
                </div>
              </>
            )
          }}
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
