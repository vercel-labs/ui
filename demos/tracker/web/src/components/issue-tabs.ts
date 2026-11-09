import { html } from "lit-html"
import { href, tabs, type Query, type Tab } from "tracker-data"

function issueTabs(query: Query, counts: Record<Tab, number>) {
  return html`<ui-tabs .value=${query.tab}>
    <ui-tabs-list
      aria-label="Issues"
      class="relative inline-flex h-8 w-fit items-center rounded-2xl bg-muted p-[3px] text-muted-foreground"
    >
      ${tabs.map(
        (tab) =>
          html`<ui-tabs-tab value=${tab.value}>
            <a
              href=${href(query, { tab: tab.value, page: 1, issue: null })}
              class="relative z-10 inline-flex h-6.5 cursor-default items-center justify-center gap-1.5 rounded-2xl px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:text-foreground"
            >
              ${tab.label}
              <span class="text-xs text-muted-foreground tabular-nums"
                >${counts[tab.value]}</span
              >
            </a>
          </ui-tabs-tab>`
      )}
      <ui-tabs-indicator
        class="pointer-events-none absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-2xl bg-background shadow-xs transition-[top,left,width,height] duration-300 ease-out data-[activation-direction=none]:transition-none motion-reduce:transition-none dark:bg-input/50"
      ></ui-tabs-indicator>
    </ui-tabs-list>
  </ui-tabs>`
}

export { issueTabs }
