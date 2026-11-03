<script setup lang="ts">
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@ui-sdk/vue/scroll-area"

const releases = Array.from({ length: 12 }, (_, row) => ({
  version: `v1.${12 - row}.0`,
  cells: [
    "Stable",
    "Downloads 12k",
    "Node 20+",
    "MIT",
    "4.1 MB",
    `2026-0${(row % 9) + 1}-14`,
    "No breaking changes",
  ],
}))
</script>

<template>
  <ScrollArea type="auto">
    <ScrollAreaViewport>
      <ScrollAreaContent>
        <table>
          <tbody>
            <tr v-for="release in releases" :key="release.version">
              <th>{{ release.version }}</th>
              <td v-for="cell in release.cells" :key="cell">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </ScrollAreaContent>
    </ScrollAreaViewport>
    <ScrollAreaScrollbar>
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar orientation="horizontal">
      <ScrollAreaThumb />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollArea>
</template>
