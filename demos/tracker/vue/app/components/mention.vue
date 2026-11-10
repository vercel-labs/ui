<script setup lang="ts">
import { personOf } from "tracker-data"
import { Avatar } from "~/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"

const props = defineProps<{ id: string; label: string }>()

const person = computed(() => personOf(props.id))
</script>

<template>
  <HoverCard v-if="person">
    <HoverCardTrigger
      class="rounded-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <template #render="{ props: trigger }">
        <NuxtLink v-bind="trigger" :to="`/?tab=all&assignee=${person.id}`"
          >@{{ person.name }}</NuxtLink
        >
      </template>
    </HoverCardTrigger>
    <HoverCardContent>
      <div class="flex items-center gap-3">
        <Avatar :name="person.name" size="lg" decorative />
        <div class="grid gap-0.5">
          <p class="font-medium">{{ person.name }}</p>
          <p class="text-muted-foreground">{{ person.role }}</p>
        </div>
      </div>
      <p class="text-xs text-muted-foreground">Select to see their issues.</p>
    </HoverCardContent>
  </HoverCard>
  <template v-else>@{{ label }}</template>
</template>
