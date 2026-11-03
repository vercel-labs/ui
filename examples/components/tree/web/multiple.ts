import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

const items: TreeItemData[] = [
  {
    value: "inbox",
    label: "Inbox",
    children: [
      { value: "updates", label: "Updates" },
      { value: "forums", label: "Forums" },
      { value: "promotions", label: "Promotions" },
    ],
  },
  {
    value: "projects",
    label: "Projects",
    children: [
      { value: "website", label: "Website" },
      { value: "mobile", label: "Mobile app" },
    ],
  },
  { value: "archive", label: "Archive" },
  { value: "trash", label: "Trash" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tree aria-label="Folders" selection-mode="multiple" default-value="updates,website" expand-on-press="false" default-expanded="inbox,projects">
        <template>
          <ui-tree-item>
            <ui-tree-item-indicator></ui-tree-item-indicator>
            <ui-tree-item-label></ui-tree-item-label>
            <ui-tree-group></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>
      <p data-slot="hint">2 selected</p>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  const output = root.querySelector("p")!
  tree.items = items
  tree.addEventListener("valuechange", (event) => {
    output.textContent = `${(event.detail.value as string[]).length} selected`
  })
}

export { mount }
