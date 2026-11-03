<script lang="ts">
  import { BoldIcon, ItalicIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"
</script>

<div dir="rtl">
  <Toolbar aria-label="تنسيق">
    <ToggleGroup multiple aria-label="نمط النص">
      <Toggle data-variant="ghost" value="bold" aria-label="غامق">
        <BoldIcon />
      </Toggle>
      <Toggle data-variant="ghost" value="italic" aria-label="مائل">
        <ItalicIcon />
      </Toggle>
    </ToggleGroup>
    <ToolbarSeparator />
    <ToolbarButton data-variant="secondary">
      حفظ
    </ToolbarButton>
  </Toolbar>
</div>
