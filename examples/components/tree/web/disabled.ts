import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/switch"
import "@ui-sdk/web/tree"

const items: TreeItemData[] = [
  {
    value: "plans",
    label: "Plans",
    children: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
      { value: "enterprise", label: "Enterprise", disabled: true },
    ],
  },
  {
    value: "legacy",
    label: "Legacy plans",
    disabled: true,
    children: [{ value: "starter", label: "Starter" }],
  },
  { value: "custom", label: "Custom" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tree aria-label="Plans" default-expanded="plans">
        <template>
          <ui-tree-item>
            <ui-tree-item-indicator></ui-tree-item-indicator>
            <ui-tree-item-label></ui-tree-item-label>
            <ui-tree-group></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>
      <label data-slot="label">
        <ui-switch default-checked>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        Focusable when disabled
      </label>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  tree.items = items
  root.querySelector("ui-switch")!.addEventListener("checkedchange", (event) => {
    tree.setAttribute("focusable-when-disabled", String(event.detail.value))
  })
}

export { mount }
