import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

const items: TreeItemData[] = [
  {
    value: "frontend",
    label: "Frontend",
    children: [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ],
  },
  {
    value: "backend",
    label: "Backend",
    children: [
      { value: "node", label: "Node" },
      {
        value: "databases",
        label: "Databases",
        children: [
          { value: "postgres", label: "Postgres" },
          { value: "sqlite", label: "SQLite" },
        ],
      },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tree aria-label="Stack" checkable selection-mode="none" check-strategy="trunk" default-checked="react,postgres" default-expanded="frontend,backend,databases">
        <template>
          <ui-tree-item>
            <ui-tree-item-checkbox></ui-tree-item-checkbox>
            <ui-tree-item-label></ui-tree-item-label>
            <ui-tree-group></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>
      <p data-slot="hint">Checked: react, postgres</p>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  const output = root.querySelector("p")!
  tree.items = items
  tree.addEventListener("checkedchange", (event) => {
    const checked = event.detail.value
    output.textContent = `Checked: ${checked.join(", ") || "nothing"}`
  })
}

export { mount }
