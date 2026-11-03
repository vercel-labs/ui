<script lang="ts">
  import { BoldIcon, ChevronDownIcon, ItalicIcon, UnderlineIcon } from "@lucide/svelte"
  import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/svelte/menu"
  import { Toggle, ToggleGroup } from "@ui-sdk/svelte/toggle"
  import { Toolbar, ToolbarButton, ToolbarSeparator } from "@ui-sdk/svelte/toolbar"

  const formatting = [
    { value: "bold", label: "Bold", icon: BoldIcon },
    { value: "italic", label: "Italic", icon: ItalicIcon },
    { value: "underline", label: "Underline", icon: UnderlineIcon },
  ]
</script>

<Toolbar aria-label="Formatting">
  <ToggleGroup multiple aria-label="Text style">
    {#each formatting as item (item.value)}
      <Toggle data-variant="ghost" value={item.value} aria-label={item.label}>
        <item.icon />
      </Toggle>
    {/each}
  </ToggleGroup>
  <ToolbarSeparator />
  <Menu>
    <ToolbarButton data-variant="secondary">
      {#snippet render({ props })}
        <MenuTrigger {...props}>
          Sans
          <ChevronDownIcon />
        </MenuTrigger>
      {/snippet}
    </ToolbarButton>
    <MenuContent>
      {#each ["Sans", "Serif", "Mono"] as font (font)}
        <MenuItem>
          {font}
        </MenuItem>
      {/each}
    </MenuContent>
  </Menu>
</Toolbar>
