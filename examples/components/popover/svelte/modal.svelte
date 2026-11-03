<script lang="ts">
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"

  const modes = [
    { label: "Non-modal", modal: false },
    { label: "Trap focus", modal: "trap-focus" },
    { label: "Modal", modal: true },
  ] as const
  let clicks = $state(0)
</script>

<div data-slot="stack">
  <div data-slot="row">
    {#each modes as mode (mode.label)}
      <Popover modal={mode.modal}>
        <PopoverTrigger>{mode.label}</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>{mode.label}</PopoverTitle>
          <PopoverDescription>Press Tab, then click the box below.</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    {/each}
  </div>
  <button type="button" onclick={() => clicks++}>
    Clicked {clicks} {clicks === 1 ? "time" : "times"}. Open a popover, then click here.
  </button>
</div>
