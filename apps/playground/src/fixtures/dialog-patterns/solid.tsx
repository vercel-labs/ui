import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/solid/alert-dialog"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { useShortcut } from "@ui-sdk/solid/shortcuts"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { dialogPatternsFixture as f } from "tests/fixtures/dialog.ts"
import { pendingAction, recordOpenChange } from "./shared"

const rename = createDialogController()

function Fixture() {
  const [action, setAction] = createSignal("")
  const [dirty, setDirty] = createSignal(false)
  const [details, setDetails] = createSignal(false)
  let field: HTMLInputElement | undefined
  useShortcut(f.pageShortcut, () => setAction("page shortcut"))
  useShortcut(f.slashShortcut, () => setAction("slash"))
  // Belongs to the dialog, so it runs while the dialog is open and modal.
  useShortcut(f.rename.save, () => setAction("saved"), {
    layer: () => field ?? null,
    allowInInput: true,
  })
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu>
        <MenuTrigger shortcut={f.menu.shortcut}>{f.menu.trigger}</MenuTrigger>
        <MenuContent class="menu">
          <MenuItem value="rename" onSelect={() => rename.open()}>
            {f.menu.rename}
          </MenuItem>
          <MenuItem value="close">{f.menu.close}</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog
        controller={rename}
        dismissible={!dirty()}
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
          {f.rename.trigger} <DialogShortcut class="shortcut" />
        </DialogTrigger>
        <DialogBackdrop class="dialog-backdrop" />
        <DialogContent class="dialog">
          <DialogTitle class="title">{f.rename.title}</DialogTitle>
          <label class="field">
            {f.rename.field}
            <input
              ref={field}
              value={f.rename.defaultValue}
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
        <AlertDialogBackdrop class="dialog-backdrop" />
        <AlertDialogContent class="dialog">
          <AlertDialogTitle class="title">{f.remove.title}</AlertDialogTitle>
          <AlertDialogDescription class="description">
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
        <PopoverContent class="popover">
          <PopoverTitle>{f.share.title}</PopoverTitle>
          <Menu>
            <MenuTrigger>{f.share.menu}</MenuTrigger>
            <MenuContent class="menu">
              <MenuItem value="copy">{f.share.item}</MenuItem>
            </MenuContent>
          </Menu>
          <Dialog>
            <DialogTrigger>{f.share.dialog}</DialogTrigger>
            <DialogContent class="dialog">
              <DialogTitle class="title">{f.share.dialogTitle}</DialogTitle>
              <DialogClose>{f.share.done}</DialogClose>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
      <Menu onAction={(value) => value === "details" && setDetails(true)}>
        <MenuTrigger>{f.details.menu}</MenuTrigger>
        <MenuContent class="menu">
          <MenuItem value="details">{f.details.item}</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog open={details()} onOpenChange={setDetails}>
        <DialogContent class="dialog">
          <DialogTitle class="title">{f.details.title}</DialogTitle>
          <DialogClose>{f.details.done}</DialogClose>
        </DialogContent>
      </Dialog>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
