<script setup lang="ts">
import { countByTab, filterIssues, parseQuery } from "tracker-data"
import IssueBoard from "~/components/issue-board.vue"
import IssueDetail from "~/components/issue-detail.vue"
import IssueList from "~/components/issue-list.vue"
import IssueTabs from "~/components/issue-tabs.vue"
import IssueToolbar from "~/components/issue-toolbar.vue"
import Workspace from "~/components/workspace.vue"

const route = useRoute()
const { data: issues } = useLazyFetch("/api/issues", {
  key: "issues",
  default: () => [],
})
const { data: settings } = useLazyFetch("/api/settings", { key: "settings" })

const query = computed(() => parseQuery(route.query))
const matching = computed(() => filterIssues(issues.value, query.value))
const counts = computed(() => countByTab(issues.value))
const issue = computed(
  () => issues.value.find(({ id }) => id === query.value.issue) ?? null
)
</script>

<template>
  <main class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2"
    >
      <IssueTabs :query="query" :counts="counts" />
      <IssueToolbar :query="query" />
    </div>
    <Workspace :open="issue !== null">
      <template #list>
        <IssueBoard
          v-if="query.view === 'board'"
          :issues="matching"
          :query="query"
        />
        <IssueList
          v-else
          :issues="matching"
          :query="query"
          :page-size="settings?.pageSize ?? 10"
        />
      </template>
      <template #detail>
        <IssueDetail
          v-if="issue"
          :key="issue.id"
          :issue="issue"
          :query="query"
        />
      </template>
    </Workspace>
  </main>
</template>
