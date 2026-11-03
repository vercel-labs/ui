import type { TreeController } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"
import { ChevronRight, createElement } from "lucide"

type Node = { value: string; label: string; children?: Node[] }

const sections: Node[] = [
  {
    value: "account",
    label: "Account",
    children: [
      { value: "profile", label: "Profile" },
      {
        value: "security",
        label: "Security",
        children: [
          { value: "password", label: "Password" },
          { value: "two-factor", label: "Two-factor authentication" },
        ],
      },
    ],
  },
  {
    value: "workspace",
    label: "Workspace",
    children: [
      { value: "members", label: "Members" },
      { value: "billing", label: "Billing" },
    ],
  },
]

function markup(list: Node[]) {
  let html = ""
  for (const item of list)
    html += `
      <ui-tree-item value="${item.value}">
        <ui-tree-item-label>
          ${
            item.children
              ? `<ui-tree-item-indicator>${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</ui-tree-item-indicator>`
              : `<span></span>`
          }
          ${item.label}
        </ui-tree-item-label>
        ${item.children ? `<ui-tree-group>${markup(item.children)}</ui-tree-group>` : ""}
      </ui-tree-item>`
  return html
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button">Expand all</button>
        <button type="button">Collapse all</button>
        <button type="button">Find two-factor</button>
      </div>
      <ui-tree aria-label="Settings" keep-mounted>
        ${markup(sections)}
      </ui-tree>
      <p data-slot="hint">Expanded: none</p>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  const output = root.querySelector("p")!
  const [expand, collapse, find] = root.querySelectorAll("button")
  expand.addEventListener("click", () => tree.api.expandAll())
  collapse.addEventListener("click", () => tree.api.collapseAll())
  find.addEventListener("click", () => tree.api.reveal("two-factor"))
  tree.addEventListener("expandedchange", (event) => {
    output.textContent = `Expanded: ${event.detail.value.join(", ") || "none"}`
  })
}

export { mount }
