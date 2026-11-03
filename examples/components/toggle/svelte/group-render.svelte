<script lang="ts">
  import { BookmarkIcon, HeartIcon, StarIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon } from "@ui-sdk/svelte/toggle"

  const reactions = [
    { value: "star", label: "Favorite", icon: StarIcon },
    { value: "heart", label: "Like", icon: HeartIcon },
    { value: "bookmark", label: "Save", icon: BookmarkIcon },
  ]
</script>

<ToggleGroup multiple aria-label="Reactions" data-variant="framed">
  {#each reactions as item (item.value)}
    <Toggle value={item.value} aria-label={item.label}>
      {#snippet render({ props, state })}
        <button {...props}>
          <ToggleIcon>
            <item.icon fill={state.pressed ? "currentColor" : "none"} />
          </ToggleIcon>
        </button>
      {/snippet}
    </Toggle>
  {/each}
</ToggleGroup>
