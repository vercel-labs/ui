import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
} from "@ui-sdk/solid/alert-dialog"
import { createSignal, For } from "solid-js"

function Example() {
  const confirm = createConfirm<{ name: string }>()
  const [projects, setProjects] = createSignal(["Acme", "Globex", "Initech"])
  let reset: HTMLButtonElement | undefined

  async function remove(name: string, button: HTMLButtonElement) {
    if (!(await confirm({ name }))) return
    const row = button.closest("li")
    const next = (row?.nextElementSibling ?? row?.previousElementSibling)?.querySelector("button")
    const target = next ?? reset
    target?.focus()
    setProjects((list) => list.filter((project) => project !== name))
  }
  return (
    <div data-slot="stack">
      <ul aria-label="Projects">
        <For each={projects()} fallback={<li data-slot="row">All projects deleted.</li>}>
          {(name) => (
            <li data-slot="row">
              {name}
              <button type="button" onClick={(event) => remove(name, event.currentTarget)}>
                Delete
              </button>
            </li>
          )}
        </For>
      </ul>
      <button
        type="button"
        ref={(element) => (reset = element)}
        onClick={() => setProjects(["Acme", "Globex", "Initech"])}
      >
        Reset projects
      </button>
      <AlertDialog controller={confirm.controller}>
        <AlertDialogBackdrop />
        <AlertDialogContent<{
          name: string
        }>>
          {(state) => (
            <>
              <div data-slot="stack">
                <AlertDialogTitle>Delete {state.payload?.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  The project and its files will be deleted for everyone.
                </AlertDialogDescription>
              </div>
              <div data-slot="row">
                <AlertDialogClose>Cancel</AlertDialogClose>
                <AlertDialogClose data-variant="solid" value="confirm">
                  Delete
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
