<script lang="ts">
  import { BellIcon } from "@lucide/svelte"
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverShortcut,
    PopoverTitle,
    PopoverTrigger,
  } from "@ui-sdk/svelte/popover"
</script>

<Popover>
  <PopoverTrigger shortcut="mod+u">
    {#snippet render({ props, state })}
      <button {...props}>
        <BellIcon />
        {state.open ? "Hide updates" : "Show updates"}
        <PopoverShortcut>
          {#snippet children(shortcut)}{shortcut.text}{/snippet}
        </PopoverShortcut>
      </button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>
      {#snippet render({ props })}
        <h3 {...props}>Updates</h3>
      {/snippet}
    </PopoverTitle>
    <PopoverDescription>Version 2.0 is out.</PopoverDescription>
    <PopoverClose href="https://example.com/changelog">
      {#snippet render({ props })}
        <a {...props}>Read the changelog</a>
      {/snippet}
    </PopoverClose>
  </PopoverContent>
</Popover>
