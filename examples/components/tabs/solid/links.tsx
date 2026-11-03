import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"
import { For } from "solid-js"

const pages = [
  { value: "overview", href: "#project-overview", label: "Overview", content: "Everything at a glance." },
  { value: "activity", href: "#project-activity", label: "Activity", content: "What changed this week." },
  { value: "members", href: "#project-members", label: "Members", content: "Who can edit the project." },
]

function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Project">
        <For each={pages}>
          {(page) => (
            <TabsTab value={page.value} render={(props) => <a {...props} href={page.href} />}>
              {page.label}
            </TabsTab>
          )}
        </For>
        <TabsIndicator />
      </TabsList>
      <For each={pages}>{(page) => <TabsPanel value={page.value}>{page.content}</TabsPanel>}</For>
    </Tabs>
  )
}

export { Example }
