<script lang="ts">
  import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"

  const formats = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "strikethrough", label: "Strikethrough", icon: StrikethroughIcon },
  ]

  let style = $state<string[]>(["bold"])
</script>

<div data-slot="stack">
  <Toolbar aria-label="Text">
    <ToggleGroup bind:value={style} multiple aria-label="Text style">
      {#each formats as format (format.value)}
        <Toggle data-variant="ghost" value={format.value} aria-label={format.label}>
          <format.icon />
        </Toggle>
      {/each}
    </ToggleGroup>
    <ToolbarSeparator />
    <Toggle data-variant="ghost" aria-label="Code">
      <CodeIcon />
    </Toggle>
    <ToolbarButton data-variant="secondary" onclick={() => (style = [])}>
      Clear
    </ToolbarButton>
  </Toolbar>
  <output data-slot="output">Style: {style.join(", ") || "none"}</output>
</div>
