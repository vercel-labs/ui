<script setup lang="ts">
import { href, type Issue, type Query, statusOf, tabs } from "tracker-data"
import { computed } from "vue"
import Assignee from "~/components/assignee.vue"
import IssueLabels from "~/components/issue-labels.vue"
import PriorityIcon from "~/components/priority-icon.vue"
import StatusIcon from "~/components/status-icon.vue"

const props = defineProps<{ issues: Issue[]; query: Query }>()

const columns = computed(() =>
  tabs
    .find((tab) => tab.value === props.query.tab)!
    .statuses.map((status) => ({
      status,
      cards: props.issues.filter((issue) => issue.status === status),
    }))
)
</script>

<template>
  <div class="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
    <section
      v-for="{ status, cards } in columns"
      :key="status"
      :aria-labelledby="`column-${status}`"
      class="flex w-72 shrink-0 flex-col gap-2 rounded-3xl bg-muted/60 p-2"
    >
      <h2
        :id="`column-${status}`"
        class="flex items-center gap-2 px-2 py-1 font-medium"
      >
        <StatusIcon :status="status" />
        {{ statusOf(status).label }}
        <span class="text-muted-foreground tabular-nums">{{
          cards.length
        }}</span>
      </h2>
      <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto">
        <li v-for="issue in cards" :key="issue.id">
          <NuxtLink
            :to="href(query, { issue: issue.id })"
            :aria-current="issue.id === query.issue || undefined"
            :data-current="issue.id === query.issue || undefined"
            class="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/5 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 data-current:ring-2 data-current:ring-ring"
          >
            <span class="flex items-center gap-2 text-xs text-muted-foreground">
              <PriorityIcon :priority="issue.priority" label />
              {{ issue.id }}
              <span class="ms-auto"><Assignee :id="issue.assignee" /></span>
            </span>
            <span class="font-medium">{{ issue.title }}</span>
            <IssueLabels
              v-if="issue.labels.length > 0"
              :labels="issue.labels"
              class="flex flex-wrap gap-1"
            />
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
