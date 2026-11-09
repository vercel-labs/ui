<script setup lang="ts">
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/vue"
import { onItemsChange } from "tests/fixtures/items.ts"
import { changedMenuGroups, menuGroups } from "tests/fixtures/menu-groups.ts"
import { onBeforeUnmount, shallowRef } from "vue"

// Groups of items the specs reorder while the menu is open.
const groups = shallowRef(menuGroups)
onBeforeUnmount(
  onItemsChange(changedMenuGroups, (next) => (groups.value = next))
)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu>
      <MenuTrigger>Actions</MenuTrigger>
      <MenuContent class="popup">
        <MenuGroup v-for="group in groups" :key="group.label">
          <MenuGroupLabel class="label">{{ group.label }}</MenuGroupLabel>
          <MenuItem
            v-for="item in group.items"
            :key="item.value"
            class="item"
            :value="item.value"
          >
            {{ item.label }}
          </MenuItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  </div>
</template>
