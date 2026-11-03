<script lang="ts">
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@ui-sdk/svelte/dialog"

  let open = $state(false)
  let log = $state<string[]>([])
  const write = (line: string) => (log = [line, ...log].slice(0, 8))
  const onOpenChange = (next: boolean, details: { reason: string }) =>
    write(`onOpenChange(${next}, "${details.reason}")`)
  const onOpenChangeComplete = (next: boolean) => write(`onOpenChangeComplete(${next})`)
</script>

<label data-slot="label">
  <input bind:checked={open} type="checkbox" />
  open
</label>
<Dialog bind:open {onOpenChange} {onOpenChangeComplete}>
  <DialogTrigger>
    Open
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContent>
    <div data-slot="stack">
      <DialogTitle>Controlled</DialogTitle>
      <DialogDescription>Close it any way you like, and watch the log.</DialogDescription>
    </div>
    <div data-slot="row">
      <DialogClose data-variant="solid">
        Close
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
<ol data-slot="log">
  {#each log as line, index (index)}
    <li>{line}</li>
  {/each}
</ol>
