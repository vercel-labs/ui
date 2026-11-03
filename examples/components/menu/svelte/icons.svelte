<script lang="ts">
  import { DownloadIcon, LinkIcon, MailIcon, ReplyIcon, ShareIcon } from "@lucide/svelte"
  import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "@ui-sdk/svelte/menu"

  let action = $state("")
</script>

<div data-slot="stack">
  <Menu onAction={(value: string) => (action = value)}>
    <MenuTrigger>
      <ShareIcon />
      Share
    </MenuTrigger>
    <MenuContent>
      <MenuItem value="copy-link">
        <MenuItemIcon>
          <LinkIcon />
        </MenuItemIcon>
        Copy link
      </MenuItem>
      <MenuItem value="email">
        <MenuItemIcon>
          <MailIcon />
        </MenuItemIcon>
        Email
      </MenuItem>
      <MenuItem value="reply">
        <MenuItemIcon mirror>
          <ReplyIcon />
        </MenuItemIcon>
        Reply
      </MenuItem>
      <MenuSeparator />
      <MenuItem value="download">
        <MenuItemIcon>
          <DownloadIcon />
        </MenuItemIcon>
        Download
      </MenuItem>
      <MenuItem value="embed">Embed</MenuItem>
    </MenuContent>
  </Menu>
  <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
</div>
