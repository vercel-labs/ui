<script lang="ts">
  import { BoldIcon, ItalicIcon, UnderlineIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup, ToggleIcon, createToggleGroupController } from "@ui-sdk/svelte/toggle"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
  ]

  const editor = createToggleGroupController()
  let value = $state(["bold"])
  let reason = $state("")
</script>

<div data-slot="stack">
  <ToggleGroup
    bind:value
    multiple
    aria-label="Text formatting"
    controller={editor}
    onValueChange={(_, details) => (reason = details.reason)}
  >
    {#each formatting as item (item.value)}
      <Toggle value={item.value} aria-label={item.label}>
        <ToggleIcon>
          <item.icon />
        </ToggleIcon>
      </Toggle>
    {/each}
  </ToggleGroup>
  <button type="button" onclick={() => editor.setValue([])}>
    Clear
  </button>
  <output data-slot="output">
    Pressed: {value.length ? value.join(", ") : "none"}{reason && `, last change: ${reason}`}
  </output>
</div>
