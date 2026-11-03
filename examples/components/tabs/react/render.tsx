import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs"

const folders = [
  { value: "inbox", label: "Inbox", count: 12 },
  { value: "unread", label: "Unread", count: 3 },
  { value: "archived", label: "Archived", count: 0 },
]

export function Example() {
  return (
    <Tabs defaultValue="inbox">
      <TabsList aria-label="Mail">
        {folders.map((folder) => (
          <TabsTab
            key={folder.value}
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
        ))}
      </TabsList>
      {folders.map((folder) => (
        <TabsPanel key={folder.value} value={folder.value}>
          {folder.count > 0 ? `${folder.count} conversations.` : "Nothing archived yet."}
        </TabsPanel>
      ))}
    </Tabs>
  )
}
