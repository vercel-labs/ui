<script lang="ts">
  import { ChevronRightIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuContent,
    MenuItem,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  const menus = [
    { name: "Instant", delay: 0 },
    { name: "Default", delay: 100 },
    { name: "Slow", delay: 500 },
  ]

  const submenus = [
    { label: "Open recent", items: ["report.pdf", "notes.md"] },
    { label: "Share", items: ["Email", "Copy link"] },
  ]
</script>

<div data-slot="row">
  {#each menus as menu (menu.name)}
    <Menu delay={menu.delay}>
      <MenuTrigger>{menu.name}</MenuTrigger>
      <MenuContent>
        <MenuItem>New file</MenuItem>
        {#each submenus as submenu (submenu.label)}
          <MenuSub>
            <MenuSubTrigger>
              {submenu.label}
              <ChevronRightIcon aria-hidden="true" />
            </MenuSubTrigger>
            <MenuSubContent>
              {#each submenu.items as label (label)}
                <MenuItem>{label}</MenuItem>
              {/each}
            </MenuSubContent>
          </MenuSub>
        {/each}
        <MenuItem>Close</MenuItem>
      </MenuContent>
    </Menu>
  {/each}
</div>
