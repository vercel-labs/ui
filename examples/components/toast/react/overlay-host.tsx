import { OverlayHost, createOverlays } from "@ui-sdk/react/overlays"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
  type ConfirmOptions,
} from "@ui-sdk/react/alert-dialog"
import { Toast, ToastDescription, ToastTitle, createToaster } from "@ui-sdk/react/toast"
import * as React from "react"

export function Example() {
  const [overlays] = React.useState(() => createOverlays())
  const [toast] = React.useState(() => createToaster({ overlays }))
  const [confirm] = React.useState(() => createConfirm({ overlays }))
  React.useEffect(
    () => () => {
      toast.dismiss()
    },
    [toast],
  )

  const [projects, setProjects] = React.useState(["Acme", "Globex"])
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
        {projects.map((name) => (
          <li data-slot="row" key={name}>
            {name}
            <button data-variant="secondary" onClick={(event) => remove(name, event.currentTarget)}>
              Delete
            </button>
          </li>
        ))}
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
            const question = state.payload
            return (
              <>
                <AlertDialogTitle>{question?.title}</AlertDialogTitle>
                <AlertDialogDescription>{question?.description}</AlertDialogDescription>
                <div data-slot="row">
                  <AlertDialogClose data-variant="secondary">{question?.cancelLabel}</AlertDialogClose>
                  <AlertDialogClose data-variant="secondary" value="confirm">
                    {question?.confirmLabel}
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
