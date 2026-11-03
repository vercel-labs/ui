<script lang="ts">
  import {
    createPopoverController,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const popover = createPopoverController()
  let open = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
  <div data-slot="row">
    <Popover bind:open controller={popover} onOpenChange={(_, details) => (reason = details.reason)}>
      <PopoverTrigger>Share</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Share this file</PopoverTitle>
        <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        <PopoverClose>Done</PopoverClose>
      </PopoverContent>
    </Popover>
    <button type="button" data-variant="ghost" onclick={() => popover.open()}>
      Open from elsewhere
    </button>
  </div>

  <output data-slot="output">{open ? "Open" : "Closed"}{reason ? `, last change: ${reason}` : ""}</output>
</div>
