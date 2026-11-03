<script setup lang="ts">
import { EllipsisIcon } from "@lucide/vue"
import {
  createMenuController,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/vue/menu"
import { ref } from "vue"

type File = { name: string; size: string }

const files: File[] = [
  { name: "Roadmap.pdf", size: "2.4 MB" },
  { name: "Budget.xlsx", size: "860 KB" },
  { name: "Team photo.jpg", size: "5.1 MB" },
]

const menu = createMenuController<File>()
const FileMenuContent = MenuContent<File>
const status = ref("")

async function openFirst(event: MouseEvent) {
  const result = await menu.open({ payload: files[0], anchor: event.currentTarget as HTMLElement })
  status.value = `Closed with ${result.reason}`
}
</script>

<template>
  <div data-slot="stack">
    <ul>
      <li v-for="file in files" :key="file.name" data-slot="row">
        {{ file.name }}
        <span data-slot="hint">{{ file.size }}</span>
        <MenuTrigger
          :controller="menu"
          :payload="file"
          :aria-label="`Actions for ${file.name}`"
          data-variant="ghost"
          data-size="sm"
        >
          <EllipsisIcon aria-hidden="true" />
        </MenuTrigger>
      </li>
    </ul>
    <Menu :controller="menu" @action="(action: string) => (status = `${action} ${menu.getPayload()?.name}`)">
      <FileMenuContent v-slot="{ state }" align="end">
        <MenuGroup>
          <MenuGroupLabel>{{ state.payload?.name }}</MenuGroupLabel>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="rename">Rename</MenuItem>
          <MenuItem value="duplicate">Duplicate</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem value="delete">Delete</MenuItem>
      </FileMenuContent>
    </Menu>
    <button data-variant="ghost" @click="openFirst">Open for {{ files[0].name }}</button>
    <output data-slot="output">{{ status || "Pick a file's actions" }}</output>
  </div>
</template>
