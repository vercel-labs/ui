<script setup lang="ts">
import { CornerDownLeftIcon } from "@lucide/vue"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/vue/menu"

const sections = [
  { href: "#composition", label: "Composition" },
  { href: "#styling", label: "Styling" },
  { href: "#api-reference", label: "API reference" },
]
</script>

<template>
  <Menu>
    <MenuTrigger>Links</MenuTrigger>
    <MenuContent>
      <MenuItem v-for="section in sections" :key="section.href" :href="section.href">
        <template #render="{ props }">
          <a v-bind="props">
            {{ section.label }}
            <CornerDownLeftIcon aria-hidden="true" />
          </a>
        </template>
      </MenuItem>
    </MenuContent>
  </Menu>
</template>
