<script lang="ts">
  import { ArchiveIcon, CopyIcon, PencilIcon, TrashIcon } from "@lucide/svelte"
  import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/svelte/menu"

  let action = $state("")
</script>

<div data-slot="stack">
  <Menu onAction={(value: string) => (action = value)}>
    <MenuTrigger>Actions</MenuTrigger>
    <MenuContent>
      <MenuItem value="edit">
        <PencilIcon />
        Edit
      </MenuItem>
      <MenuItem value="duplicate">
        <CopyIcon />
        Duplicate
      </MenuItem>
      <MenuItem value="archive">
        <ArchiveIcon />
        Archive
      </MenuItem>
      <MenuSeparator />
      <MenuItem value="delete" destructive>
        <TrashIcon />
        Delete
      </MenuItem>
    </MenuContent>
  </Menu>
  <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
</div>
