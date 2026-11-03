<script lang="ts">
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"
  import { Menubar } from "@ui-sdk/svelte/menubar"
</script>

<div data-slot="stack">
  <Menubar>
    <Menu>
      <MenuTrigger>File</MenuTrigger>
      <MenuContent>
        <MenuItem>New File</MenuItem>
        <MenuItem disabled>Revert File</MenuItem>
      </MenuContent>
    </Menu>
    <Menu>
      <MenuTrigger disabled>Share</MenuTrigger>
      <MenuContent>
        <MenuItem>Email link</MenuItem>
      </MenuContent>
    </Menu>
  </Menubar>
  <Menubar disabled>
    {#each ["Edit", "View"] as label (label)}
      <Menu>
        <MenuTrigger>{label}</MenuTrigger>
        <MenuContent>
          <MenuItem>Unavailable</MenuItem>
        </MenuContent>
      </Menu>
    {/each}
  </Menubar>
</div>
