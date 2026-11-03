<script lang="ts">
  import { BoldIcon, ItalicIcon } from "@lucide/svelte"
  import { Toggle, ToggleIcon } from "@ui-sdk/svelte/toggle"
</script>

<div data-slot="row">
  <Toggle data-variant="outline">
    <ToggleIcon>
      <ItalicIcon />
    </ToggleIcon>
    Italic
  </Toggle>
  <Toggle data-variant="outline">
    <ToggleIcon>
      <BoldIcon />
    </ToggleIcon>
    Bold
  </Toggle>
</div>
