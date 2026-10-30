<script lang="ts">
  import Assignee from "#lib/components/assignee.svelte"
  import IssueLabels from "#lib/components/issue-labels.svelte"
  import PriorityIcon from "#lib/components/priority-icon.svelte"
  import StatusIcon from "#lib/components/status-icon.svelte"
  import { href, statusOf, tabs, type Issue, type Query } from "tracker-data"

  let { issues, query }: { issues: Issue[]; query: Query } = $props()

  const columns = $derived(tabs.find((tab) => tab.value === query.tab)!.statuses)
</script>

<div class="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
  {#each columns as status (status)}
    {@const cards = issues.filter((issue) => issue.status === status)}
    <section aria-labelledby={`column-${status}`} class="flex w-72 shrink-0 flex-col gap-2 rounded-3xl bg-muted/60 p-2">
      <h2 id={`column-${status}`} class="flex items-center gap-2 px-2 py-1 font-medium">
        <StatusIcon {status} />
        {statusOf(status).label}
        <span class="text-muted-foreground tabular-nums">{cards.length}</span>
      </h2>
      <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto">
        {#each cards as issue (issue.id)}
          <li>
            <a
              href={href(query, { issue: issue.id })}
              aria-current={issue.id === query.issue || undefined}
              data-current={issue.id === query.issue || undefined}
              class="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/5 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 data-current:ring-2 data-current:ring-ring"
            >
              <span class="flex items-center gap-2 text-xs text-muted-foreground">
                <PriorityIcon priority={issue.priority} label />
                {issue.id}
                <span class="ms-auto"><Assignee id={issue.assignee} /></span>
              </span>
              <span class="font-medium">{issue.title}</span>
              {#if issue.labels.length > 0}
                <IssueLabels labels={issue.labels} class="flex flex-wrap gap-1" />
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>
