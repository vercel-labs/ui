import { For } from "solid-js"
import { href, tabs, type Query, type Tab } from "tracker-data"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"

function IssueTabs(props: { query: Query; counts: Record<Tab, number> }) {
  return (
    <Tabs value={props.query.tab}>
      <TabsList aria-label="Issues">
        <For each={tabs}>
          {(tab) => (
            <TabsTab
              value={tab.value}
              render={(attributes) => (
                <a
                  {...attributes}
                  href={href(props.query, {
                    tab: tab.value,
                    page: 1,
                    issue: null,
                  })}
                  aria-current="false"
                />
              )}
            >
              {tab.label}
              <span class="text-xs text-muted-foreground tabular-nums">
                {props.counts[tab.value]}
              </span>
            </TabsTab>
          )}
        </For>
      </TabsList>
    </Tabs>
  )
}

export { IssueTabs }
