<script lang="ts">
  import { ChevronRightIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuContent,
    MenuItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  let status = $state("Closed")
</script>

<div data-slot="stack">
  <Menu
    onOpenChange={(open: boolean) => (status = open ? "Opening" : "Closing")}
    onOpenChangeComplete={(open: boolean) => (status = open ? "Open" : "Closed")}
  >
    <MenuTrigger>Animated</MenuTrigger>
    <MenuContent keepMounted>
      <MenuItem>Back</MenuItem>
      <MenuItem>Forward</MenuItem>
      <MenuItem>Reload</MenuItem>
      <MenuSeparator />
      <MenuSub>
        <MenuSubTrigger>
          More tools
          <ChevronRightIcon aria-hidden="true" />
        </MenuSubTrigger>
        <MenuSubContent>
          <MenuItem>Save page as…</MenuItem>
          <MenuItem>Developer tools</MenuItem>
        </MenuSubContent>
      </MenuSub>
    </MenuContent>
  </Menu>
  <output data-slot="output">{status}</output>
</div>
