<script lang="ts">
  import { ArchiveIcon, MailIcon, TrashIcon } from "@lucide/svelte"
  import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/svelte/toolbar"
</script>

<div data-slot="stack">
  <Toolbar aria-label="Message">
    <ToolbarButton data-variant="secondary">
      <MailIcon />
      Reply
    </ToolbarButton>
    <ToolbarButton data-variant="secondary" disabled>
      <ArchiveIcon />
      Archive
    </ToolbarButton>
    <ToolbarButton data-variant="secondary" aria-label="Delete" disabled focusableWhenDisabled={false}>
      <TrashIcon />
    </ToolbarButton>
  </Toolbar>
  <Toolbar disabled aria-label="Comment">
    <ToolbarInput aria-label="Comment" value="Read only for now" />
    <ToolbarButton data-variant="secondary">
      Send
    </ToolbarButton>
  </Toolbar>
</div>
