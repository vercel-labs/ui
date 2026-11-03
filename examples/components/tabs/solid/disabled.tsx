import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"

function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Dashboard">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="analytics">Analytics</TabsTab>
        <TabsTab value="reports" disabled>
          Reports
        </TabsTab>
      </TabsList>
      <TabsPanel value="overview">Revenue, visitors and sign-ups for the last 30 days.</TabsPanel>
      <TabsPanel value="analytics">Where visitors come from and what they do.</TabsPanel>
      <TabsPanel value="reports">Reports are available on the Pro plan.</TabsPanel>
    </Tabs>
  )
}

export { Example }
