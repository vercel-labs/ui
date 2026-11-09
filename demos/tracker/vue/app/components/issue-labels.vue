<script setup lang="ts">
import { labelOf } from "tracker-data"
import { computed } from "vue"
import { Badge } from "~/components/ui/badge"

const props = defineProps<{ labels: string[] }>()

const items = computed(() =>
  props.labels.map(labelOf).filter((label) => label !== undefined)
)
</script>

<template>
  <ul aria-label="Labels">
    <li v-for="label in items" :key="label.id">
      <Badge>
        <span
          class="size-2 rounded-full"
          :style="{ background: label.color }"
        ></span>
        {{ label.name }}
      </Badge>
    </li>
  </ul>
</template>
