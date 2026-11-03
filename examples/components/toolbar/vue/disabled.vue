<script setup lang="ts">
import { ArchiveIcon, MailIcon, TrashIcon } from "@lucide/vue"
import { Toolbar, ToolbarButton, ToolbarInput } from "@ui-sdk/vue/toolbar"
</script>

<template>
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
      <ToolbarButton data-variant="secondary" aria-label="Delete" disabled :focusable-when-disabled="false">
        <TrashIcon />
      </ToolbarButton>
    </Toolbar>
    <Toolbar disabled aria-label="Comment">
      <ToolbarInput aria-label="Comment" value="Read only for now" />
      <ToolbarButton data-variant="secondary">Send</ToolbarButton>
    </Toolbar>
  </div>
</template>
