import { useSearchParams } from "@solidjs/router"
import { createMemo, Show } from "solid-js"
import { countByTab, filterIssues, parseQuery } from "tracker-data"
import { IssueBoard } from "@/components/issue-board"
import { IssueDetail } from "@/components/issue-detail"
import { IssueList } from "@/components/issue-list"
import { IssueTabs } from "@/components/issue-tabs"
import { IssueToolbar } from "@/components/issue-toolbar"
import { Workspace } from "@/components/workspace"
import { db, getIssue } from "@/lib/tracker"

function IssuesPage() {
  const [params] = useSearchParams()
  const query = createMemo(() => parseQuery(params))
  const counts = createMemo(() => countByTab(db.issues))
  const matching = createMemo(() => filterIssues(db.issues, query()), {
    equals: (a, b) =>
      a.length === b.length && a.every((issue, index) => issue === b[index]),
  })
  const issue = createMemo(() => getIssue(query().issue))

  return (
    <main class="flex min-h-0 flex-1 flex-col">
      <div class="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
        <IssueTabs query={query()} counts={counts()} />
        <IssueToolbar query={query()} />
      </div>
      <Workspace
        open={Boolean(issue())}
        detail={
          <Show when={issue()} keyed>
            {(issue) => <IssueDetail issue={issue} query={query()} />}
          </Show>
        }
      >
        <Show
          when={query().view === "board"}
          fallback={
            <IssueList
              issues={matching()}
              query={query()}
              pageSize={db.settings.pageSize}
            />
          }
        >
          <IssueBoard issues={matching()} query={query()} />
        </Show>
      </Workspace>
    </main>
  )
}

export { IssuesPage }
