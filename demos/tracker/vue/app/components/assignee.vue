<script setup lang="ts">
import { personOf } from "tracker-data"
import { computed } from "vue"
import { Avatar } from "~/components/ui/avatar"

const props = defineProps<{ id: string | null }>()

const person = computed(() => personOf(props.id))
</script>

<template>
  <Avatar v-if="person" :name="person.name" />
  <span v-else class="size-7 shrink-0"></span>
</template>
