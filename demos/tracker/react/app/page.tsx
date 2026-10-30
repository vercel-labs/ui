import { resizableStorageKey } from "@ui-sdk/core/resizable"
import { cookies } from "next/headers"
import { IssueBoard } from "@/components/issue-board"
import { IssueDetail } from "@/components/issue-detail"
import { IssueList } from "@/components/issue-list"
import { IssueTabs } from "@/components/issue-tabs"
import { IssueToolbar } from "@/components/issue-toolbar"
import { Workspace } from "@/components/workspace"
import { getIssue, getSettings, listIssues } from "tracker-data/store"
import { countByTab, filterIssues, parseQuery, savedSizes, type SearchParams } from "tracker-data"

async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = parseQuery(await searchParams)
  const issues = listIssues()
  const matching = filterIssues(issues, query)
  const issue = query.issue ? getIssue(query.issue) : null
  const sizes = savedSizes((await cookies()).get(resizableStorageKey("tracker"))?.value)

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
        <IssueTabs query={query} counts={countByTab(issues)} />
        <IssueToolbar query={query} />
      </div>
      <Workspace sizes={sizes} detail={issue && <IssueDetail key={issue.id} issue={issue} query={query} />}>
        {query.view === "board" ? (
          <IssueBoard issues={matching} query={query} />
        ) : (
          <IssueList issues={matching} query={query} pageSize={getSettings().pageSize} />
        )}
      </Workspace>
    </main>
  )
}

export default Page
