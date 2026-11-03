<script lang="ts">
  import { CheckIcon, ExternalLinkIcon, FileIcon, MessageCircleIcon } from "@lucide/svelte"
  import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"

  let page = $state("conversation")

  function follow(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    page = (event.currentTarget as HTMLAnchorElement).hash.slice(1)
  }
</script>

<div data-slot="stack">
  <Toolbar aria-label="Pull request">
    <ToolbarButton data-variant="secondary" aria-label="Approve">
      <CheckIcon />
    </ToolbarButton>
    <ToolbarButton data-variant="secondary" aria-label="Comment">
      <MessageCircleIcon />
    </ToolbarButton>
    <ToolbarSeparator />
    <ToolbarLink href="#files" onclick={follow}>
      <FileIcon />
      Files changed
    </ToolbarLink>
    <ToolbarLink aria-label="Checks" href="#checks" onclick={follow}>
      <ExternalLinkIcon />
    </ToolbarLink>
  </Toolbar>
  <p data-slot="hint">Showing: {page}</p>
</div>
