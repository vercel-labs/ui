<script lang="ts">
  import { Toolbar, ToolbarButton } from "@ui-sdk/svelte/toolbar"
</script>

<Toolbar loop={false} aria-label="Pages">
  {#each ["First", "Previous", "Next", "Last"] as label (label)}
    <ToolbarButton data-variant="secondary">
      {label}
    </ToolbarButton>
  {/each}
</Toolbar>
