<script lang="ts">
  import { LinkIcon, MailIcon, SaveIcon, ShareIcon } from "@lucide/svelte"
  import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "@ui-sdk/svelte/menu"
  import { Toolbar, ToolbarButton } from "@ui-sdk/svelte/toolbar"

  let action = $state("nothing yet")
</script>

<div data-slot="stack">
  <Toolbar aria-label="Document">
    <ToolbarButton data-variant="secondary" onclick={() => (action = "save")}>
      <SaveIcon />
      Save
    </ToolbarButton>
    <Menu onAction={(value) => (action = value)}>
      <ToolbarButton data-variant="secondary">
        {#snippet render({ props })}
          <MenuTrigger {...props}>
            <ShareIcon />
            Share
          </MenuTrigger>
        {/snippet}
      </ToolbarButton>
      <MenuContent>
        <MenuItem value="email">
          <MenuItemIcon>
            <MailIcon />
          </MenuItemIcon>
          Email
        </MenuItem>
        <MenuItem value="link">
          <MenuItemIcon>
            <LinkIcon />
          </MenuItemIcon>
          Copy link
        </MenuItem>
      </MenuContent>
    </Menu>
    <ToolbarButton data-variant="secondary" onclick={() => (action = "print")}>
      Print
    </ToolbarButton>
  </Toolbar>
  <output data-slot="output">Last: {action}</output>
</div>
