<script lang="ts">
  import {
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuTrigger,
  } from "@ui-sdk/svelte"
  import { onItemsChange } from "tests/fixtures/items.ts"
  import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups.ts"

  // Groups of items the specs reorder while the menu is open. The listener
  // is a document one, so it waits for the client.
  let groups = $state.raw(menuGroups)
  $effect(() => onItemsChange(changedMenuGroups, (next) => (groups = next)))
</script>

<div class="fixture">
  <button>Before</button>
  <Menu>
    <MenuTrigger>Actions</MenuTrigger>
    <MenuContent class="popup">
      {#each groups as group (group.label)}
        <MenuGroup>
          <MenuGroupLabel class="label">{group.label}</MenuGroupLabel>
          {#each group.items as item (item.value)}
            <MenuItem class="item" value={item.value}>{item.label}</MenuItem>
          {/each}
        </MenuGroup>
      {/each}
    </MenuContent>
  </Menu>
</div>
