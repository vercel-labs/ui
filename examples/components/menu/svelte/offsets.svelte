<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Menu,
    MenuContent,
    MenuGroupLabel,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuTrigger,
  } from "@ui-sdk/svelte/menu"

  const fonts = [
    "Inter",
    "Geist",
    "IBM Plex Sans",
    "Source Sans",
    "Work Sans",
    "Manrope",
    "DM Sans",
    "Figtree",
    "Outfit",
    "Lexend",
    "Nunito",
    "Rubik",
    "Karla",
    "Barlow",
    "Mulish",
    "Urbanist",
    "Sora",
    "Onest",
  ]

  let font = $state("Inter")
</script>

<Menu>
  <MenuTrigger>
    {font}
    <ChevronDownIcon aria-hidden="true" />
  </MenuTrigger>
  <MenuContent sideOffset={8} alignOffset={-4} collisionPadding={24}>
    <MenuRadioGroup bind:value={font}>
      <MenuGroupLabel>Font</MenuGroupLabel>
      {#each fonts as name (name)}
        <MenuRadioItem value={name} closeOnSelect>
          <MenuItemIndicator>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          {name}
        </MenuRadioItem>
      {/each}
    </MenuRadioGroup>
  </MenuContent>
</Menu>
