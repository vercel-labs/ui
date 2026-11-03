<script lang="ts">
  import { BookmarkIcon } from "@lucide/svelte"
  import { Toggle, ToggleIcon } from "@ui-sdk/svelte/toggle"
</script>

<Toggle aria-label="Bookmark">
  <ToggleIcon data-variant="fill">
    <BookmarkIcon />
  </ToggleIcon>
</Toggle>
