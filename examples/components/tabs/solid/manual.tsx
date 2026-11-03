import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"

function Example() {
  return (
    <Tabs defaultValue="preview" activation="manual">
      <TabsList aria-label="Snippet">
        <TabsTab value="preview">Preview</TabsTab>
        <TabsTab value="code">Code</TabsTab>
        <TabsTab value="tests" disabled>
          Tests
        </TabsTab>
      </TabsList>
      <TabsPanel value="preview">The rendered snippet.</TabsPanel>
      <TabsPanel value="code">
        Edit the snippet's source.
        <input aria-label="Source" defaultValue="<Tabs />" />
      </TabsPanel>
    </Tabs>
  )
}

export { Example }
