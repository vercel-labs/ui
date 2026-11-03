<script lang="ts">
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"
  import { Menubar } from "@ui-sdk/svelte/menubar"
</script>

<Menubar modal>
  {#each ["File", "Edit", "View"] as label (label)}
    <Menu>
      <MenuTrigger>{label}</MenuTrigger>
      <MenuContent>
        <MenuItem>{label} settings</MenuItem>
      </MenuContent>
    </Menu>
  {/each}
</Menubar>
