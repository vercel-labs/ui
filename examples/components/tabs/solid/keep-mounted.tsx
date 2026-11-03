import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"

function Example() {
  return (
    <Tabs defaultValue="reply">
      <TabsList aria-label="Comment">
        <TabsTab value="reply">Reply</TabsTab>
        <TabsTab value="formatting">Formatting</TabsTab>
        <TabsIndicator />
      </TabsList>
      <TabsPanel value="reply" keepMounted>
        <textarea aria-label="Reply" placeholder="Write a reply…" />
      </TabsPanel>
      <TabsPanel value="formatting">Use **bold**, _italics_ and `code`. Paste a link to embed it.</TabsPanel>
    </Tabs>
  )
}

export { Example }
