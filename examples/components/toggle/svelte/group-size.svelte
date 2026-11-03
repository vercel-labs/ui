<script lang="ts">
  import { BoldIcon, ItalicIcon, UnderlineIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
  ]

  const sizes = [
    { label: "Text formatting, small", size: "sm" },
    { label: "Text formatting", size: undefined },
    { label: "Text formatting, large", size: "lg" },
  ]
</script>

<div data-slot="stack">
  {#each sizes as size (size.label)}
    <ToggleGroup multiple aria-label={size.label}>
      {#each formatting as item (item.value)}
        <Toggle value={item.value} aria-label={item.label} data-size={size.size}>
          <ToggleIcon>
            <item.icon />
          </ToggleIcon>
        </Toggle>
      {/each}
    </ToggleGroup>
  {/each}
</div>
