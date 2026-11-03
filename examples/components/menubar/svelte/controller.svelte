<script lang="ts">
  import { createMenubarController, Menubar } from "@ui-sdk/svelte/menubar"
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"
  import { useShortcut } from "@ui-sdk/svelte/shortcuts"

  const menubar = createMenubarController()

  let open = $state("none")
  useShortcut("alt+m", () => menubar.focus())
</script>

<div data-slot="stack">
  <Menubar controller={menubar}>
    {#each ["File", "Edit"] as label (label)}
      <Menu onOpenChange={(next: boolean) => (open = next ? label : "none")}>
        <MenuTrigger>{label}</MenuTrigger>
        <MenuContent>
          <MenuItem closeOnSelect={false} onSelect={() => menubar.close()}>
            Close from the controller
          </MenuItem>
        </MenuContent>
      </Menu>
    {/each}
  </Menubar>
  <div data-slot="row">
    <button type="button" onclick={() => menubar.focus()}>
      Focus menubar
    </button>
    <output data-slot="output">Open: {open} · Alt+M focuses it too</output>
  </div>
</div>
