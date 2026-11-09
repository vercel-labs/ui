import { html } from "lit-html"
import { keyed } from "lit-html/directives/keyed.js"
import { countByTab, filterIssues } from "tracker-data"
import { issueBoard } from "../components/issue-board"
import { issueDetail } from "../components/issue-detail"
import { issueList } from "../components/issue-list"
import { issueTabs } from "../components/issue-tabs"
import { issueToolbar } from "../components/issue-toolbar"
import { workspace } from "../components/workspace"
import { query } from "../lib/router"
import { db, issueOf } from "../lib/tracker"

function issuesPage() {
  const current = query()
  const matching = filterIssues(db.issues, current)
  const issue = issueOf(current.issue)

  return html`<main class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2"
    >
      ${issueTabs(current, countByTab(db.issues))} ${issueToolbar(current)}
    </div>
    ${workspace(
      current.view === "board"
        ? issueBoard(matching, current)
        : issueList(matching, current, db.settings.pageSize),
      issue ? keyed(issue.id, issueDetail(issue, current)) : null
    )}
  </main>`
}

export { issuesPage }
