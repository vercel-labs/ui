import { cn } from "cn"
import { html } from "lit-html"
import { href, type Query } from "tracker-data"
import { icon } from "../lib/icons"
import { navigate, query as currentQuery } from "../lib/router"
import { button, styles, tooltip } from "../lib/ui"
import { issueFilters } from "./issue-filters"
import { onChange } from "../lib/view"

function layoutToggle(value: Query["view"], label: string) {
  return tooltip(
    html`<ui-toggle value=${value}>
      <button aria-label=${label} class=${styles.toggle}>
        ${icon(value === "list" ? "list" : "columns")}
      </button>
    </ui-toggle>`,
    label,
  )
}

function issueToolbar(query: Query) {
  const filtered = Boolean(query.priority || query.assignee)
  const change = (patch: Partial<Query>) => navigate(href(query, patch))

  return html`<div class="ms-auto flex items-center gap-2">
    <div class="max-md:hidden">${issueFilters(query, change)}</div>
    <ui-drawer class="contents">
      <ui-drawer-trigger>
        <button class=${cn(button({ variant: filtered ? "secondary" : "ghost" }), "md:hidden")}>
          ${icon("sliders")} Filters
        </button>
      </ui-drawer-trigger>
      <ui-drawer-backdrop
        class="fixed inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm"
      ></ui-drawer-backdrop>
      <ui-drawer-content
        class="relative mx-auto flex max-h-[85dvh] w-full max-w-lg flex-col rounded-t-[min(var(--radius-4xl),24px)] bg-popover text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none after:absolute after:inset-x-0 after:top-full after:h-24 after:bg-inherit dark:ring-foreground/10"
      >
        <div aria-hidden="true" class="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted"></div>
        <div class="grid gap-5 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ui-drawer-title class="block text-base font-medium">Filters</ui-drawer-title>
          ${issueFilters(query, change, { stacked: true })}
          <ui-drawer-close
            ><button class=${cn(button({ variant: "primary" }), "w-full")}>Done</button></ui-drawer-close
          >
        </div>
      </ui-drawer-content>
    </ui-drawer>
    <ui-toggle-group
      aria-label="Layout"
      .value=${[query.view]}
      deselectable="false"
      @valuechange=${onChange(
        () => [currentQuery().view],
        ([view]) => change({ view, page: 1 }),
      )}
      class="flex w-fit items-center gap-0.5 rounded-2xl bg-muted p-0.5"
    >
      ${layoutToggle("list", "List")} ${layoutToggle("board", "Board")}
    </ui-toggle-group>
  </div>`
}

export { issueToolbar }
