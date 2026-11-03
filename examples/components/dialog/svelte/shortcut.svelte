<script lang="ts">
  import { FileIcon, SearchIcon } from "@lucide/svelte"
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogShortcut,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"

  const pages = ["Introduction", "Installation", "Dialog", "Alert Dialog", "Menu"]
</script>

<Dialog>
  <DialogTrigger shortcut="mod+j">
    <SearchIcon aria-hidden="true" />
    Search docs
    <DialogShortcut />
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <DialogTitle>Search docs</DialogTitle>
    <input aria-label="Search" placeholder="Search…" />
    <div data-slot="stack">
      {#each pages as page (page)}
        <DialogClose value={page}>
          <FileIcon aria-hidden="true" />
          {page}
        </DialogClose>
      {/each}
    </div>
  </DialogContent>
</Dialog>
