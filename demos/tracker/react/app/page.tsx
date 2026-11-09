import { resizableStorageKey } from "@ui-sdk/core/resizable"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { getIssue, getSettings, listIssues } from "@/app/data"
import { CurrentIssueBar, IssueBar } from "@/components/issue-bar"
import { IssueBoard } from "@/components/issue-board"
import { IssueDetail } from "@/components/issue-detail"
import { IssueList, IssueListSkeleton } from "@/components/issue-list"
import { Workspace } from "@/components/workspace"
import { countByTab, filterIssues, parseQuery, savedSizes } from "tracker-data"

async function IssueWorkspace({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const query = parseQuery(await searchParams)
  const [issues, issue, settings, cookieStore] = await Promise.all([
    listIssues(),
    query.issue ? getIssue(query.issue) : null,
    getSettings(),
    cookies(),
  ])
  const matching = filterIssues(issues, query)
  const sizes = savedSizes(
    cookieStore.get(resizableStorageKey("tracker"))?.value
  )

  return (
    <Workspace
      sizes={sizes}
      detail={
        issue && <IssueDetail key={issue.id} issue={issue} query={query} />
      }
    >
      {query.view === "board" ? (
        <IssueBoard issues={matching} query={query} />
      ) : (
        <IssueList
          issues={matching}
          query={query}
          pageSize={settings.pageSize}
        />
      )}
    </Workspace>
  )
}

async function Page({ searchParams }: PageProps<"/">) {
  const [issues, settings] = await Promise.all([listIssues(), getSettings()])
  const counts = countByTab(issues)

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <Suspense fallback={<IssueBar query={parseQuery({})} counts={counts} />}>
        <CurrentIssueBar counts={counts} />
      </Suspense>
      <Suspense fallback={<IssueListSkeleton rows={settings.pageSize} />}>
        <IssueWorkspace searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

export default Page
