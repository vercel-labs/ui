import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  createConfirm,
} from "@ui-sdk/solid/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { isServer, render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import {
  alertDialogFixture,
  alertDialogOptions,
  dialogContentOptions,
  dialogFixture,
  dialogOptions,
  dialogParts,
} from "tests/fixtures/dialog.ts"
import { exposeDialogFixture, recordOpenChange } from "./shared"

const controller = createDialogController()
const confirm = createConfirm()

function Fixture() {
  // Read here, not at module level, so the server reads each request's URL,
  // and the window is only touched where there is one.
  if (!isServer) {
    exposeDialogFixture(controller, confirm)
  }
  const parts = dialogParts()
  const [action, setAction] = createSignal("")
  const [triggerShown, setTriggerShown] = createSignal(true)
  return (
    <div class="fixture">
      <button>Before</button>
      <Dialog
        controller={controller}
        {...dialogOptions()}
        onOpenChange={(open, details) => {
          recordOpenChange("dialog", open, details)
          if (!open && details.returnValue) {
            setAction(details.returnValue)
          }
        }}
      >
        <Show when={triggerShown()}>
          <DialogTrigger>{dialogFixture.trigger}</DialogTrigger>
        </Show>
        <Show when={parts.backdrop}>
          <DialogBackdrop class="dialog-backdrop" />
        </Show>
        <DialogContent class="dialog" {...dialogContentOptions()}>
          <Show when={parts.title}>
            <DialogTitle class="title">{dialogFixture.title}</DialogTitle>
          </Show>
          <DialogDescription class="description">
            {dialogFixture.description}
          </DialogDescription>
          <label class="field">
            {dialogFixture.field}
            <input value={dialogFixture.defaultValue} />
          </label>
          <Show when={parts.long}>
            <p class="long">{dialogFixture.long}</p>
          </Show>
          <div class="actions">
            <button onClick={() => setAction("save")}>
              {dialogFixture.action}
            </button>
            <DialogClose>{dialogFixture.close}</DialogClose>
            <Show when={parts.removable}>
              <button onClick={() => setTriggerShown(false)}>
                {dialogFixture.remove}
              </button>
            </Show>
          </div>
          <Show when={parts.form}>
            <form method="dialog">
              <button value={dialogFixture.form.value}>
                {dialogFixture.form.label}
              </button>
            </form>
          </Show>
          <Show when={parts.nested}>
            <Dialog
              onOpenChange={(open, details) =>
                recordOpenChange("nested", open, details)
              }
            >
              <DialogTrigger>{dialogFixture.nested.trigger}</DialogTrigger>
              <Show when={parts.backdrop}>
                <DialogBackdrop class="dialog-backdrop" />
              </Show>
              <DialogContent class="dialog">
                <DialogTitle class="title">
                  {dialogFixture.nested.title}
                </DialogTitle>
                <DialogClose>{dialogFixture.nested.close}</DialogClose>
              </DialogContent>
            </Dialog>
          </Show>
        </DialogContent>
      </Dialog>
      <AlertDialog controller={confirm.controller} {...alertDialogOptions()}>
        <AlertDialogTrigger>{alertDialogFixture.trigger}</AlertDialogTrigger>
        <Show when={parts.backdrop}>
          <AlertDialogBackdrop class="dialog-backdrop" />
        </Show>
        <AlertDialogContent class="dialog">
          <AlertDialogTitle class="title">
            {alertDialogFixture.title}
          </AlertDialogTitle>
          <AlertDialogDescription class="description">
            {alertDialogFixture.description}
          </AlertDialogDescription>
          <div class="actions">
            <AlertDialogClose>{alertDialogFixture.cancel}</AlertDialogClose>
            <AlertDialogClose
              value="confirm"
              onClick={() => setAction("delete")}
            >
              {alertDialogFixture.action}
            </AlertDialogClose>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      <Show when={parts.shortcut}>
        <DialogTrigger
          controller={controller}
          shortcut={dialogFixture.shortcut.keys}
        >
          {dialogFixture.shortcut.trigger} <DialogShortcut />
        </DialogTrigger>
      </Show>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
