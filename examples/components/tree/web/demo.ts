import "@ui-sdk/web/tree"
import { ChevronRight, createElement, File, Folder, FolderOpen, type IconNode } from "lucide"

type Node = { value: string; label: string; children?: Node[] }

const files: Node[] = [
  {
    value: "app",
    label: "app",
    children: [
      { value: "app/layout.tsx", label: "layout.tsx" },
      { value: "app/page.tsx", label: "page.tsx" },
      {
        value: "app/settings",
        label: "settings",
        children: [{ value: "app/settings/page.tsx", label: "page.tsx" }],
      },
    ],
  },
  {
    value: "components",
    label: "components",
    children: [
      { value: "components/button.tsx", label: "button.tsx" },
      { value: "components/card.tsx", label: "card.tsx" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "README.md", label: "README.md" },
]

const icon = (node: IconNode) => createElement(node, { "aria-hidden": "true" }).outerHTML

function items(list: Node[]) {
  let html = ""
  for (const item of list)
    html += `
      <ui-tree-item value="${item.value}">
        <ui-tree-item-label>
          ${
            item.children
              ? `<ui-tree-item-indicator>${icon(ChevronRight)}</ui-tree-item-indicator>
                ${icon(Folder)}
                ${icon(FolderOpen)}`
              : `<span></span>
                ${icon(File)}`
          }
          <span>${item.label}</span>
        </ui-tree-item-label>
        ${item.children ? `<ui-tree-group>${items(item.children)}</ui-tree-group>` : ""}
      </ui-tree-item>`
  return html
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tree aria-label="Files" default-expanded="app" default-value="app/page.tsx">
      ${items(files)}
    </ui-tree>
  `
}

export { mount }
