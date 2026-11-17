<script lang="ts">
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte"

  let open = $state(false)
</script>

<div class="fixture">
  <button>Before</button>
  <Menu {open} onOpenChange={(next) => (open = next)}>
    <MenuTrigger>Actions</MenuTrigger>
    {#if open}
      <MenuContent class="popup fill-in">
        <MenuItem class="item" value="rename">Rename</MenuItem>
        <MenuItem class="item" value="delete">Delete</MenuItem>
      </MenuContent>
    {/if}
  </Menu>
</div>
