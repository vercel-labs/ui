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
  import { perfItems, perfSize } from "tests/fixtures/perf.ts"

  // Many dialogs on one page, like a delete confirmation in every row of a
  // table, for the counts specs. Only the first one is opened.
  const items = perfItems(perfSize())
</script>

<div class="fixture" style="flex-wrap: wrap">
  <button>Before</button>
  {#each items as item (item.value)}
    <Dialog>
      <DialogTrigger>Delete {item.label}</DialogTrigger>
      <DialogBackdrop class="dialog-backdrop" />
      <DialogContent class="dialog">
        <DialogTitle class="title">Delete {item.label}?</DialogTitle>
        <DialogDescription class="description"
          >This can't be undone.</DialogDescription
        >
        <div class="actions">
          <DialogClose>Cancel</DialogClose>
          <button>Delete</button>
        </div>
      </DialogContent>
    </Dialog>
  {/each}
  <button>After</button>
</div>
