<script lang="ts">
  import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
    createDialogController,
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Popover,
    PopoverContent,
    PopoverTitle,
    PopoverTrigger,
    useShortcut,
  } from "@ui-sdk/svelte"
  import { dialogPatternsFixture as f } from "tests/fixtures/dialog.ts"
  import { pendingAction, recordOpenChange } from "./shared"

  const rename = createDialogController()
  let action = $state("")
  let dirty = $state(false)
  let details = $state(false)
  let field: HTMLInputElement | undefined = $state()
  const popoverRoot = document.getElementById("popover-root")
  useShortcut(f.pageShortcut, () => (action = "page shortcut"))
  useShortcut(f.slashShortcut, () => (action = "slash"))
  // Belongs to the dialog, so it runs while the dialog is open and modal.
  useShortcut(f.rename.save, () => (action = "saved"), {
    layer: () => field,
    allowInInput: true,
  })

  function onRenameChange(open: boolean, details: { reason: string }) {
    recordOpenChange("rename", open, details)
    if (!open) {
      dirty = false
    }
  }
</script>

<div class="fixture">
  <button>Before</button>
  <Menu>
    <MenuTrigger shortcut={f.menu.shortcut}>{f.menu.trigger}</MenuTrigger>
    <MenuContent>
      <MenuItem value="rename" onSelect={() => rename.open()}
        >{f.menu.rename}</MenuItem
      >
      <MenuItem value="close">{f.menu.close}</MenuItem>
    </MenuContent>
  </Menu>
  <Dialog
    controller={rename}
    dismissible={!dirty}
    persistentElements={["#chat"]}
    onDismissAttempt={(details) => (action = `attempt:${details.reason}`)}
    onOpenChange={onRenameChange}
  >
    <DialogTrigger shortcut={f.rename.shortcut}>
      {f.rename.trigger}
      <DialogShortcut class="shortcut" />
    </DialogTrigger>
    <DialogBackdrop class="dialog-backdrop" />
    <DialogContent class="dialog">
      <DialogTitle class="title">{f.rename.title}</DialogTitle>
      <label class="field">
        {f.rename.field}
        <input
          bind:this={field}
          value={f.rename.defaultValue}
          oninput={() => (dirty = true)}
        />
      </label>
      <DialogClose>{f.rename.cancel}</DialogClose>
    </DialogContent>
  </Dialog>
  <AlertDialog
    onOpenChange={(open, details) => recordOpenChange("delete", open, details)}
  >
    <AlertDialogTrigger>{f.remove.trigger}</AlertDialogTrigger>
    <AlertDialogBackdrop class="dialog-backdrop" />
    <AlertDialogContent class="dialog">
      <AlertDialogTitle class="title">{f.remove.title}</AlertDialogTitle>
      <AlertDialogDescription class="description"
        >{f.remove.description}</AlertDialogDescription
      >
      <AlertDialogClose>{f.remove.cancel}</AlertDialogClose>
      <AlertDialogClose value="confirm" action={pendingAction}
        >{f.remove.action}</AlertDialogClose
      >
    </AlertDialogContent>
  </AlertDialog>
  <label>
    {f.search}
    <input />
  </label>
  <button id="chat" onclick={() => (action = "chat")}>{f.chat}</button>
  <Popover container={popoverRoot}>
    <PopoverTrigger shortcut={f.share.shortcut}
      >{f.share.trigger}</PopoverTrigger
    >
    <PopoverContent>
      <PopoverTitle>{f.share.title}</PopoverTitle>
      <Menu>
        <MenuTrigger>{f.share.menu}</MenuTrigger>
        <MenuContent>
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
  <Menu onAction={(value) => value === "details" && (details = true)}>
    <MenuTrigger>{f.details.menu}</MenuTrigger>
    <MenuContent>
      <MenuItem value="details">{f.details.item}</MenuItem>
    </MenuContent>
  </Menu>
  <Dialog bind:open={details}>
    <DialogContent class="dialog">
      <DialogTitle class="title">{f.details.title}</DialogTitle>
      <DialogClose>{f.details.done}</DialogClose>
    </DialogContent>
  </Dialog>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
