import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/solid/tabs"
import { For } from "solid-js"

const folders = [
  { value: "inbox", label: "Inbox", count: 12 },
  { value: "unread", label: "Unread", count: 3 },
  { value: "archived", label: "Archived", count: 0 },
]

export function Example() {
  return (
    <Tabs defaultValue="inbox">
      <TabsList aria-label="Mail">
        <For each={folders}>
          {(folder) => (
            <TabsTab
              value={folder.value}
              render={(props) => (
                <button {...props}>
                  {props.children}
                  {folder.count > 0 && <span data-slot="row">{folder.count}</span>}
                </button>
              )}
            >
              {folder.label}
            </TabsTab>
          )}
        </For>
      </TabsList>
      <For each={folders}>
        {(folder) => (
          <TabsPanel value={folder.value}>
            {folder.count > 0 ? `${folder.count} conversations.` : "Nothing archived yet."}
          </TabsPanel>
        )}
      </For>
    </Tabs>
  )
}
