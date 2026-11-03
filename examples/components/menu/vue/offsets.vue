<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@lucide/vue"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

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

const font = ref("Inter")
</script>

<template>
  <Menu>
    <MenuTrigger>
      {{ font }}
      <ChevronDownIcon aria-hidden="true" />
    </MenuTrigger>
    <MenuContent :side-offset="8" :align-offset="-4" :collision-padding="24">
      <MenuRadioGroup v-model:value="font">
        <MenuGroupLabel>Font</MenuGroupLabel>
        <MenuRadioItem v-for="name in fonts" :key="name" :value="name" close-on-select>
          <MenuItemIndicator>
            <CheckIcon aria-hidden="true" />
          </MenuItemIndicator>
          {{ name }}
        </MenuRadioItem>
      </MenuRadioGroup>
    </MenuContent>
  </Menu>
</template>
