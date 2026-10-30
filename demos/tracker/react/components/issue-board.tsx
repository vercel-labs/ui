import Link from "next/link"
import { href, statusOf, tabs, type Issue, type Query } from "tracker-data"
import { Assignee } from "@/components/assignee"
import { PriorityIcon, StatusIcon } from "@/components/issue-icons"
import { IssueLabels } from "@/components/issue-labels"

function IssueBoard({ issues, query }: { issues: Issue[]; query: Query }) {
  const columns = tabs.find((tab) => tab.value === query.tab)!.statuses
  return (
    <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
      {columns.map((status) => {
        const cards = issues.filter((issue) => issue.status === status)
        return (
          <section
            key={status}
            aria-labelledby={`column-${status}`}
            className="flex w-72 shrink-0 flex-col gap-2 rounded-3xl bg-muted/60 p-2"
          >
            <h2 id={`column-${status}`} className="flex items-center gap-2 px-2 py-1 font-medium">
              <StatusIcon status={status} />
              {statusOf(status).label}
              <span className="text-muted-foreground tabular-nums">{cards.length}</span>
            </h2>
            <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
              {cards.map((issue) => (
                <li key={issue.id}>
                  <Link
                    href={href(query, { issue: issue.id })}
                    scroll={false}
                    aria-current={issue.id === query.issue || undefined}
                    data-current={issue.id === query.issue || undefined}
                    className="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/5 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 data-current:ring-2 data-current:ring-ring"
                  >
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <PriorityIcon priority={issue.priority} label />
                      {issue.id}
                      <span className="ms-auto">
                        <Assignee id={issue.assignee} />
                      </span>
                    </span>
                    <span className="font-medium">{issue.title}</span>
                    {issue.labels.length > 0 && (
                      <IssueLabels labels={issue.labels} className="flex flex-wrap gap-1" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export { IssueBoard }
