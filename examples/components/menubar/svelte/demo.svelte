<script lang="ts">
  import { CheckIcon, ChevronRightIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuItem,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"
  import { Menubar } from "@ui-sdk/svelte/menubar"

  const profiles = [
    { value: "andy", label: "Andy" },
    { value: "benoit", label: "Benoit" },
    { value: "luis", label: "Luis" },
  ]
</script>

<Menubar>
  <Menu>
    <MenuTrigger>File</MenuTrigger>
    <MenuContent>
      <MenuItem shortcut="mod+t">New Tab</MenuItem>
      <MenuItem shortcut="mod+n">New Window</MenuItem>
      <MenuItem disabled>New Incognito Window</MenuItem>
      <MenuSeparator />
      <MenuSub>
        <MenuSubTrigger>
          Share
          <ChevronRightIcon aria-hidden="true" />
        </MenuSubTrigger>
        <MenuSubContent>
          <MenuItem>Email link</MenuItem>
          <MenuItem>Messages</MenuItem>
          <MenuItem>Notes</MenuItem>
        </MenuSubContent>
      </MenuSub>
      <MenuSeparator />
      <MenuItem shortcut="mod+p">Print…</MenuItem>
    </MenuContent>
  </Menu>
  <Menu>
    <MenuTrigger>Edit</MenuTrigger>
    <MenuContent>
      <MenuItem shortcut="mod+z">Undo</MenuItem>
      <MenuItem shortcut="mod+shift+z">Redo</MenuItem>
      <MenuSeparator />
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
    </MenuContent>
  </Menu>
  <Menu>
    <MenuTrigger>View</MenuTrigger>
    <MenuContent>
      <MenuCheckboxItem value="bookmarks">
        <MenuItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuItemIndicator>
        Always Show Bookmarks Bar
      </MenuCheckboxItem>
      <MenuCheckboxItem value="urls" defaultChecked>
        <MenuItemIndicator>
          <CheckIcon aria-hidden="true" />
        </MenuItemIndicator>
        Always Show Full URLs
      </MenuCheckboxItem>
      <MenuSeparator />
      <MenuItem shortcut="mod+r">Reload</MenuItem>
      <MenuItem>Toggle Fullscreen</MenuItem>
    </MenuContent>
  </Menu>
  <Menu>
    <MenuTrigger>Profiles</MenuTrigger>
    <MenuContent>
      <MenuRadioGroup defaultValue="benoit">
        {#each profiles as profile (profile.value)}
          <MenuRadioItem value={profile.value}>
            <MenuItemIndicator />
            {profile.label}
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
      <MenuSeparator />
      <MenuItem>Edit…</MenuItem>
      <MenuItem>Add Profile…</MenuItem>
    </MenuContent>
  </Menu>
</Menubar>
