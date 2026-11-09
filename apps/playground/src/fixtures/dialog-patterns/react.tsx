import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { useShortcut } from "@ui-sdk/react/shortcuts"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { dialogPatternsFixture as f } from "tests/fixtures/dialog.ts"
import { pendingAction, recordOpenChange } from "./shared"

const rename = createDialogController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [dirty, setDirty] = React.useState(false)
  const [details, setDetails] = React.useState(false)
  const field = React.useRef<HTMLInputElement>(null)
  useShortcut(f.pageShortcut, () => setAction("page shortcut"))
  useShortcut(f.slashShortcut, () => setAction("slash"))
  // Belongs to the dialog, so it runs while the dialog is open and modal.
  useShortcut(f.rename.save, () => setAction("saved"), {
    layer: field,
    allowInInput: true,
  })
  return (
    <div className="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger shortcut={f.menu.shortcut}>{f.menu.trigger}</MenuTrigger>
        <MenuContent className="menu">
          <MenuItem value="rename" onSelect={() => rename.open()}>
            {f.menu.rename}
          </MenuItem>
          <MenuItem value="close">{f.menu.close}</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog
        controller={rename}
        dismissible={!dirty}
        persistentElements={["#chat"]}
        onDismissAttempt={({ reason }) => setAction(`attempt:${reason}`)}
        onOpenChange={(open, details) => {
          recordOpenChange("rename", open, details)
          if (!open) {
            setDirty(false)
          }
        }}
      >
        <DialogTrigger shortcut={f.rename.shortcut}>
          {f.rename.trigger} <DialogShortcut className="shortcut" />
        </DialogTrigger>
        <DialogBackdrop className="dialog-backdrop" />
        <DialogContent className="dialog">
          <DialogTitle className="title">{f.rename.title}</DialogTitle>
          <label className="field">
            {f.rename.field}
            <input
              ref={field}
              defaultValue={f.rename.defaultValue}
              onInput={() => setDirty(true)}
            />
          </label>
          <DialogClose>{f.rename.cancel}</DialogClose>
        </DialogContent>
      </Dialog>
      <AlertDialog
        onOpenChange={(open, details) =>
          recordOpenChange("delete", open, details)
        }
      >
        <AlertDialogTrigger>{f.remove.trigger}</AlertDialogTrigger>
        <AlertDialogBackdrop className="dialog-backdrop" />
        <AlertDialogContent className="dialog">
          <AlertDialogTitle className="title">
            {f.remove.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="description">
            {f.remove.description}
          </AlertDialogDescription>
          <AlertDialogClose>{f.remove.cancel}</AlertDialogClose>
          <AlertDialogClose value="confirm" action={pendingAction}>
            {f.remove.action}
          </AlertDialogClose>
        </AlertDialogContent>
      </AlertDialog>
      <label>
        {f.search}
        <input />
      </label>
      <button id="chat" onClick={() => setAction("chat")}>
        {f.chat}
      </button>
      <Popover container={document.getElementById("popover-root")}>
        <PopoverTrigger shortcut={f.share.shortcut}>
          {f.share.trigger}
        </PopoverTrigger>
        <PopoverContent className="popover">
          <PopoverTitle>{f.share.title}</PopoverTitle>
          <Menu>
            <MenuTrigger>{f.share.menu}</MenuTrigger>
            <MenuContent className="menu">
              <MenuItem value="copy">{f.share.item}</MenuItem>
            </MenuContent>
          </Menu>
          <Dialog>
            <DialogTrigger>{f.share.dialog}</DialogTrigger>
            <DialogContent className="dialog">
              <DialogTitle className="title">{f.share.dialogTitle}</DialogTitle>
              <DialogClose>{f.share.done}</DialogClose>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
      <Menu onAction={(value) => value === "details" && setDetails(true)}>
        <MenuTrigger>{f.details.menu}</MenuTrigger>
        <MenuContent className="menu">
          <MenuItem value="details">{f.details.item}</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog open={details} onOpenChange={setDetails}>
        <DialogContent className="dialog">
          <DialogTitle className="title">{f.details.title}</DialogTitle>
          <DialogClose>{f.details.done}</DialogClose>
        </DialogContent>
      </Dialog>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
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

export { mount }
