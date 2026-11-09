import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  createConfirm,
} from "@ui-sdk/react/alert-dialog"
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
} from "@ui-sdk/react/dialog"
import * as React from "react"
import { createRoot } from "react-dom/client"
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
exposeDialogFixture(controller, confirm)

const parts = dialogParts()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [triggerShown, setTriggerShown] = React.useState(true)
  return (
    <div className="fixture">
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
        {triggerShown && <DialogTrigger>{dialogFixture.trigger}</DialogTrigger>}
        {parts.backdrop && <DialogBackdrop className="dialog-backdrop" />}
        <DialogContent className="dialog" {...dialogContentOptions()}>
          {parts.title && (
            <DialogTitle className="title">{dialogFixture.title}</DialogTitle>
          )}
          <DialogDescription className="description">
            {dialogFixture.description}
          </DialogDescription>
          <label className="field">
            {dialogFixture.field}
            <input defaultValue={dialogFixture.defaultValue} />
          </label>
          {parts.long && <p className="long">{dialogFixture.long}</p>}
          <div className="actions">
            <button onClick={() => setAction("save")}>
              {dialogFixture.action}
            </button>
            <DialogClose>{dialogFixture.close}</DialogClose>
            {parts.removable && (
              <button onClick={() => setTriggerShown(false)}>
                {dialogFixture.remove}
              </button>
            )}
          </div>
          {parts.form && (
            <form method="dialog">
              <button value={dialogFixture.form.value}>
                {dialogFixture.form.label}
              </button>
            </form>
          )}
          {parts.nested && (
            <Dialog
              onOpenChange={(open, details) =>
                recordOpenChange("nested", open, details)
              }
            >
              <DialogTrigger>{dialogFixture.nested.trigger}</DialogTrigger>
              {parts.backdrop && <DialogBackdrop className="dialog-backdrop" />}
              <DialogContent className="dialog">
                <DialogTitle className="title">
                  {dialogFixture.nested.title}
                </DialogTitle>
                <DialogClose>{dialogFixture.nested.close}</DialogClose>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog controller={confirm.controller} {...alertDialogOptions()}>
        <AlertDialogTrigger>{alertDialogFixture.trigger}</AlertDialogTrigger>
        {parts.backdrop && <AlertDialogBackdrop className="dialog-backdrop" />}
        <AlertDialogContent className="dialog">
          <AlertDialogTitle className="title">
            {alertDialogFixture.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="description">
            {alertDialogFixture.description}
          </AlertDialogDescription>
          <div className="actions">
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
        {action}
      </output>
      <button onClick={() => controller.open()}>Open with controller</button>
      {parts.shortcut && (
        <DialogTrigger
          controller={controller}
          shortcut={dialogFixture.shortcut.keys}
        >
          {dialogFixture.shortcut.trigger} <DialogShortcut />
        </DialogTrigger>
      )}
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
