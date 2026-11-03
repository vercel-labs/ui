<script setup lang="ts">
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

const position = ref("bottom")
</script>

<template>
  <div data-slot="stack">
    <Menu>
      <MenuTrigger>Panel</MenuTrigger>
      <MenuContent>
        <MenuRadioGroup v-model:value="position" name="position">
          <MenuGroupLabel>Position</MenuGroupLabel>
          <MenuRadioItem
            v-for="option in ['Top', 'Bottom', 'Right']"
            :key="option"
            :value="option.toLowerCase()"
          >
            <MenuItemIndicator />
            {{ option }}
          </MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuRadioGroup default-value="comfortable">
          <MenuGroupLabel>Density</MenuGroupLabel>
          <MenuRadioItem
            v-for="option in ['Compact', 'Comfortable']"
            :key="option"
            :value="option.toLowerCase()"
          >
            <MenuItemIndicator />
            {{ option }}
          </MenuRadioItem>
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
    <output data-slot="output">Panel at the {{ position }}</output>
  </div>
</template>
