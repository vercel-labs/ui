<script lang="ts">
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"

  let container: HTMLElement | undefined = $state()
</script>

<div data-slot="row">
  <Menu>
    <MenuTrigger>Open</MenuTrigger>
    <MenuContent {container}>
      <MenuItem>Rendered in the panel</MenuItem>
      <MenuItem>Still placed by the trigger</MenuItem>
    </MenuContent>
  </Menu>
  <div data-slot="card">
    Container
    <div bind:this={container}></div>
  </div>
</div>
