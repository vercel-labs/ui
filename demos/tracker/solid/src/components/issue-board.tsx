import { createMemo, For, Show } from "solid-js"
import { href, statusOf, tabs, type Issue, type Query } from "tracker-data"
import { Assignee } from "@/components/assignee"
import { PriorityIcon, StatusIcon } from "@/components/issue-icons"
import { IssueLabels } from "@/components/issue-labels"

function IssueBoard(props: { issues: Issue[]; query: Query }) {
  const columns = () =>
    tabs.find((tab) => tab.value === props.query.tab)!.statuses
  return (
    <div class="flex min-h-0 flex-1 gap-3 overflow-x-auto p-3">
      <For each={columns()}>
        {(status) => {
          const cards = createMemo(() =>
            props.issues.filter((issue) => issue.status === status)
          )
          return (
            <section
              aria-labelledby={`column-${status}`}
              class="flex w-72 shrink-0 flex-col gap-2 rounded-3xl bg-muted/60 p-2"
            >
              <h2
                id={`column-${status}`}
                class="flex items-center gap-2 px-2 py-1 font-medium"
              >
                <StatusIcon status={status} />
                {statusOf(status).label}
                <span class="text-muted-foreground tabular-nums">
                  {cards().length}
                </span>
              </h2>
              <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto">
                <For each={cards()}>
                  {(issue) => (
                    <li>
                      <a
                        href={href(props.query, { issue: issue.id })}
                        noscroll
                        data-current={
                          issue.id === props.query.issue || undefined
                        }
                        class="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-xs ring-1 ring-foreground/5 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 data-current:ring-2 data-current:ring-ring"
                      >
                        <span class="flex items-center gap-2 text-xs text-muted-foreground">
                          <PriorityIcon priority={issue.priority} label />
                          {issue.id}
                          <span class="ms-auto">
                            <Assignee id={issue.assignee} />
                          </span>
                        </span>
                        <span class="font-medium">{issue.title}</span>
                        <Show when={issue.labels.length > 0}>
                          <IssueLabels
                            labels={issue.labels}
                            class="flex flex-wrap gap-1"
                          />
                        </Show>
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          )
        }}
      </For>
    </div>
  )
}

export { IssueBoard }
