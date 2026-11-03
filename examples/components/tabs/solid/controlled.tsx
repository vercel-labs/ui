import { createTabsController } from "@ui-sdk/core/tabs"
import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"
import { createSignal } from "solid-js"

function Example() {
  const tabs = createTabsController()
  const [value, setValue] = createSignal<string | null>("inbox")
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <Tabs
        value={value()}
        onValueChange={(next, details) => {
          setValue(next)
          setReason(details.reason)
        }}
        controller={tabs}
      >
        <TabsList aria-label="Mail">
          <TabsTab value="inbox">Inbox</TabsTab>
          <TabsTab value="drafts">Drafts</TabsTab>
          <TabsTab value="sent">Sent</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="inbox">No new mail.</TabsPanel>
        <TabsPanel value="drafts">Two drafts.</TabsPanel>
        <TabsPanel value="sent">Sent this week: 12.</TabsPanel>
      </Tabs>
      <div data-slot="row">
        <button type="button" onClick={() => tabs.select("sent")}>
          Show sent mail
        </button>
      </div>
      <output data-slot="output">
        Selected: {value()}
        {reason() ? `, last change: ${reason()}` : ""}
      </output>
    </div>
  )
}

export { Example }
