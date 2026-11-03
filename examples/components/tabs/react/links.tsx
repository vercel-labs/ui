"use client"

import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"

const pages = [
  { value: "overview", href: "#project-overview", label: "Overview", content: "Everything at a glance." },
  { value: "activity", href: "#project-activity", label: "Activity", content: "What changed this week." },
  { value: "members", href: "#project-members", label: "Members", content: "Who can edit the project." },
]

function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project">
        {pages.map((page) => (
          <TabsTab key={page.value} value={page.value} render={<a href={page.href} />}>
            {page.label}
          </TabsTab>
        ))}
        <TabsIndicator />
      </TabsList>
      {pages.map((page) => (
        <TabsPanel key={page.value} value={page.value}>
          {page.content}
        </TabsPanel>
      ))}
    </Tabs>
  )
}

export { Example }
