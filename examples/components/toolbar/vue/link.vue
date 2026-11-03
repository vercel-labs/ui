<script setup lang="ts">
import { CheckIcon, ExternalLinkIcon, FileIcon, MessageCircleIcon } from "@lucide/vue"
import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator } from "@ui-sdk/vue/toolbar"
import { ref } from "vue"

const page = ref("conversation")

function follow(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }
  event.preventDefault()
  page.value = (event.currentTarget as HTMLAnchorElement).hash.slice(1)
}
</script>

<template>
  <div data-slot="stack">
    <Toolbar aria-label="Pull request">
      <ToolbarButton data-variant="secondary" aria-label="Approve">
        <CheckIcon />
      </ToolbarButton>
      <ToolbarButton data-variant="secondary" aria-label="Comment">
        <MessageCircleIcon />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarLink href="#files" @click="follow">
        <FileIcon />
        Files changed
      </ToolbarLink>
      <ToolbarLink aria-label="Checks" href="#checks" @click="follow">
        <ExternalLinkIcon />
      </ToolbarLink>
    </Toolbar>
    <p data-slot="hint">Showing: {{ page }}</p>
  </div>
</template>
