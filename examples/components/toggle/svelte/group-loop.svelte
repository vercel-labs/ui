<script lang="ts">
  import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
    { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
  ]
</script>

<ToggleGroup multiple loop={false} aria-label="Text formatting">
  {#each formatting as item (item.value)}
    <Toggle value={item.value} aria-label={item.label}>
      <ToggleIcon>
        <item.icon />
      </ToggleIcon>
    </Toggle>
  {/each}
</ToggleGroup>
