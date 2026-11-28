import { Component } from "@angular/core"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsList, TabsPanel, TabsTab],
  template: `
    <div uiTabs defaultValue="inbox">
      <div uiTabsList aria-label="Mail">
        @for (folder of folders; track folder.value) {
          <button uiTabsTab [value]="folder.value">
            {{ folder.label }}
            @if (folder.count > 0) {
              <span data-slot="badge">{{ folder.count }}</span>
            }
          </button>
        }
      </div>
      @for (folder of folders; track folder.value) {
        <div uiTabsPanel [value]="folder.value">{{ folder.content }}</div>
      }
    </div>
  `,
})
class Example {
  readonly folders = [
    {
      value: "inbox",
      label: "Inbox",
      count: 12,
      content: "12 conversations, 3 of them unread.",
    },
    {
      value: "unread",
      label: "Unread",
      count: 3,
      content: "Hollis Grant, Inès Moreau and Kofi Mensah wrote to you.",
    },
    {
      value: "archived",
      label: "Archived",
      count: 0,
      content: "Nothing archived yet. Archived mail stays searchable.",
    },
  ]
}

export { Example }
