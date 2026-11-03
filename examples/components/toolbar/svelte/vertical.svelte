<script lang="ts">
  import { ImageIcon, MoveHorizontalIcon, PencilIcon, TrashIcon } from "@lucide/svelte"
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"

  const tools = [
    { value: "pencil", label: "Pencil", icon: PencilIcon },
    { value: "image", label: "Image", icon: ImageIcon },
    { value: "move", label: "Move", icon: MoveHorizontalIcon },
  ]
</script>

<Toolbar orientation="vertical" aria-label="Tools">
  <ToggleGroup defaultValue={["pencil"]} aria-label="Tool" orientation="vertical">
    {#each tools as tool (tool.value)}
      <Toggle data-variant="ghost" value={tool.value} aria-label={tool.label}>
        <tool.icon />
      </Toggle>
    {/each}
  </ToggleGroup>
  <ToolbarSeparator />
  <ToolbarButton data-variant="secondary" aria-label="Delete">
    <TrashIcon />
  </ToolbarButton>
</Toolbar>
