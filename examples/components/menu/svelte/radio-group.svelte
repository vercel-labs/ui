<script lang="ts">
  import {
    Menu,
    MenuContent,
    MenuGroupLabel,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  let position = $state("bottom")
</script>

<div data-slot="stack">
  <Menu>
    <MenuTrigger>Panel</MenuTrigger>
    <MenuContent>
      <MenuRadioGroup bind:value={position} name="position">
        <MenuGroupLabel>Position</MenuGroupLabel>
        {#each ["Top", "Bottom", "Right"] as option (option)}
          <MenuRadioItem value={option.toLowerCase()}>
              <MenuItemIndicator />
            {option}
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
      <MenuSeparator />
      <MenuRadioGroup defaultValue="comfortable">
        <MenuGroupLabel>Density</MenuGroupLabel>
        {#each ["Compact", "Comfortable"] as option (option)}
          <MenuRadioItem value={option.toLowerCase()}>
              <MenuItemIndicator />
            {option}
          </MenuRadioItem>
        {/each}
      </MenuRadioGroup>
    </MenuContent>
  </Menu>
  <output data-slot="output">Panel at the {position}</output>
</div>
