<script lang="ts">
  import { createMenuController, Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"

  const menu = createMenuController()

  let open = $state(false)
  let reason = $state("")
</script>

<div data-slot="stack">
  <div data-slot="row">
    <Menu
      bind:open
      controller={menu}

      onOpenChange={(_: boolean, details: { reason: string }) => (reason = details.reason)}
    >
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">Rename</MenuItem>
        <MenuItem value="duplicate">Duplicate</MenuItem>
        <MenuItem value="archive">Archive</MenuItem>
      </MenuContent>
    </Menu>
    <button data-variant="ghost" onclick={() => open = true}>
      Open with state
    </button>
    <button data-variant="ghost" onclick={() => menu.open({ focus: "first" })}>
      Open with the controller
    </button>
  </div>

  <output data-slot="output">{open ? "Open" : "Closed"}{reason && `, last change: ${reason}`}</output>
</div>
