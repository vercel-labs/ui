import { html, nothing } from "lit-html"
import { repeat } from "lit-html/directives/repeat.js"
import { href, statusOf, tabs, type Issue, type Query } from "tracker-data"
import { assignee, issueLabels, priorityIcon, statusIcon } from "../lib/ui"

function card(issue: Issue, query: Query) {
  return html`<li>
    <a
      href=${href(query, { issue: issue.id })}
      aria-current=${issue.id === query.issue ? "true" : nothing}
      ?data-current=${issue.id === query.issue}
      class="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/5 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 data-current:ring-2 data-current:ring-ring"
    >
      <span class="flex items-center gap-2 text-xs text-muted-foreground">
        ${priorityIcon(issue.priority, { label: true })} ${issue.id}
        <span class="ms-auto">${assignee(issue.assignee)}</span>
      </span>
      <span class="font-medium">${issue.title}</span>
      ${issue.labels.length > 0 ? issueLabels(issue.labels, "flex flex-wrap gap-1") : nothing}
    </a>
  </li>`
}

function issueBoard(issues: Issue[], query: Query) {
  const columns = tabs.find((tab) => tab.value === query.tab)!.statuses
  return html`<div class="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
    ${columns.map((status) => {
      const cards = issues.filter((issue) => issue.status === status)
      return html`<section
        aria-labelledby=${`column-${status}`}
        class="flex w-72 shrink-0 flex-col gap-2 rounded-3xl bg-muted/60 p-2"
      >
        <h2 id=${`column-${status}`} class="flex items-center gap-2 px-2 py-1 font-medium">
          ${statusIcon(status)} ${statusOf(status).label}
          <span class="text-muted-foreground tabular-nums">${cards.length}</span>
        </h2>
        <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto">
          ${repeat(
            cards,
            (issue) => issue.id,
            (issue) => card(issue, query),
          )}
        </ul>
      </section>`
    })}
  </div>`
}

export { issueBoard }
