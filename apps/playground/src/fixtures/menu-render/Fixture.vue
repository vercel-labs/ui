<script setup lang="ts">
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@ui-sdk/vue"
import { ref } from "vue"

// Counts renders of each custom item, so specs can check what re-renders.
const renders = { watched: 0, plain: 0 }
;(window as unknown as { __renders: typeof renders }).__renders = renders

const action = ref("")
const count = (key: "watched" | "plain") => (renders[key]++, "")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Menu @action="(value: string) => (action = value)">
      <MenuTrigger>File</MenuTrigger>
      <MenuContent class="popup">
        <MenuItem class="item" value="docs" href="#docs">
          <template #render="{ props }">
            <a v-bind="props">Docs</a>
          </template>
        </MenuItem>
        <MenuItem class="item" value="watched">
          <template #render="{ props, state }">
            <div v-bind="props">
              {{ count("watched") }}{{ state.highlighted ? "→ " : "" }}Watched
            </div>
          </template>
        </MenuItem>
        <MenuItem class="item" value="plain">
          <template #render="{ props }">
            <div v-bind="props">{{ count("plain") }}Plain</div>
          </template>
        </MenuItem>
        <MenuCheckboxItem v-slot="{ state }" value="pinned" class="item">
          <span :class="state.checked ? 'is-checked' : 'is-unchecked'"
            >Pinned</span
          >
        </MenuCheckboxItem>
      </MenuContent>
    </Menu>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
