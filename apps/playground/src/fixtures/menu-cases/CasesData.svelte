<script lang="ts">
  import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@ui-sdk/svelte/dialog"
  import { Menu, MenuTrigger } from "@ui-sdk/svelte"
  import { casesData } from "./data"

  let action = $state("")
  let align = $state("left")
  let journal = $state(false)
  let shortcuts = $state(true)
  const items = $derived(casesData({ align, journal }))
</script>

<div class="fixture">
  <button>Before</button>
  <Menu {items} itemShortcuts={shortcuts} onAction={(value) => (action = value)}>
    <MenuTrigger>Edit</MenuTrigger>
  </Menu>
  <button onclick={() => (align = "right")}>Align right</button>
  <button onclick={() => (journal = true)}>Add journal</button>
  <button onclick={() => (shortcuts = false)}>Turn off shortcuts</button>
  <button>After</button>
  <input aria-label="Notes" />
  <Dialog>
    <DialogTrigger>Open dialog</DialogTrigger>
    <DialogContent class="dialog">
      <DialogTitle class="title">Settings</DialogTitle>
      <DialogClose>Close</DialogClose>
    </DialogContent>
  </Dialog>
  <output role="status" aria-label="Last action">{action}</output>
</div>
