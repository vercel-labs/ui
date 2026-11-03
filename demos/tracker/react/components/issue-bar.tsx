"use client"

import { useSearchParams } from "next/navigation"
import { parseQuery, type Query, type Tab } from "tracker-data"
import { IssueTabs } from "@/components/issue-tabs"
import { IssueToolbar } from "@/components/issue-toolbar"

function IssueBar({ query, counts }: { query: Query; counts: Record<Tab, number> }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
      <IssueTabs query={query} counts={counts} />
      <IssueToolbar query={query} />
    </div>
  )
}

function CurrentIssueBar({ counts }: { counts: Record<Tab, number> }) {
  return <IssueBar query={parseQuery(Object.fromEntries(useSearchParams()))} counts={counts} />
}

export { CurrentIssueBar, IssueBar }
