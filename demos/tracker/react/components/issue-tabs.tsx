import Link from "next/link"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { href, tabs, type Query, type Tab } from "tracker-data"

function IssueTabs({
  query,
  counts,
}: {
  query: Query
  counts: Record<Tab, number>
}) {
  return (
    <Tabs value={query.tab}>
      <TabsList aria-label="Issues">
        {tabs.map((tab) => (
          <TabsTab
            key={tab.value}
            value={tab.value}
            render={
              <Link
                href={href(query, { tab: tab.value, page: 1, issue: null })}
                prefetch
              />
            }
          >
            {tab.label}
            <span className="text-xs text-muted-foreground tabular-nums">
              {counts[tab.value]}
            </span>
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  )
}

export { IssueTabs }
