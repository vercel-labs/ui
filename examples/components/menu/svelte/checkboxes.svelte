<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItemIndicator,
    MenuSeparator,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  let statusBar = $state(true)
  let minimap = $state(false)
</script>

<div data-slot="stack">
  <Menu>
    <MenuTrigger>View</MenuTrigger>
    <MenuContent>
      <MenuGroup>
        <MenuGroupLabel>Appearance</MenuGroupLabel>
        <MenuCheckboxItem bind:checked={statusBar} value="status-bar">
          <MenuItemIndicator keepMounted>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Status bar
        </MenuCheckboxItem>
        <MenuCheckboxItem bind:checked={minimap} value="minimap">
          <MenuItemIndicator keepMounted>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          Minimap
        </MenuCheckboxItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuCheckboxItem value="line-numbers" defaultChecked>
        <MenuItemIndicator keepMounted>
          <CheckIcon aria-hidden="true" />
        </MenuItemIndicator>
        Line numbers
      </MenuCheckboxItem>
      <MenuCheckboxItem value="word-wrap">
        <MenuItemIndicator keepMounted>
          <CheckIcon aria-hidden="true" />
        </MenuItemIndicator>
        Word wrap
      </MenuCheckboxItem>
    </MenuContent>
  </Menu>
  <output data-slot="output">
    Status bar {statusBar ? "shown" : "hidden"}, minimap {minimap ? "shown" : "hidden"}
  </output>
</div>
