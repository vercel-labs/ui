<script lang="ts">
  import { BoldIcon, BookmarkIcon, HeartIcon, ItalicIcon, StarIcon, UnderlineIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
  ]

  const favorites = [
    { value: "star", label: "Star", icon: StarIcon },
    { value: "heart", label: "Heart", icon: HeartIcon },
    { value: "bookmark", label: "Bookmark", icon: BookmarkIcon },
  ]
</script>

<div data-slot="stack">
  <ToggleGroup multiple aria-label="Text formatting">
    {#each formatting as item (item.value)}
      <Toggle value={item.value} aria-label={item.label}>
        <ToggleIcon>
          <item.icon />
        </ToggleIcon>
      </Toggle>
    {/each}
  </ToggleGroup>
  <ToggleGroup multiple data-variant="spaced" aria-label="Favorites">
    {#each favorites as item (item.value)}
      <Toggle value={item.value} data-variant="outline">
        <ToggleIcon data-variant="fill">
          <item.icon />
        </ToggleIcon>
        {item.label}
      </Toggle>
    {/each}
  </ToggleGroup>
</div>
