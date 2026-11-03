import "@ui-sdk/web/tree"
import { ChevronLeft, createElement } from "lucide"

type Node = { value: string; label: string; children?: Node[] }

const folders: Node[] = [
  {
    value: "documents",
    label: "المستندات",
    children: [
      { value: "reports", label: "التقارير" },
      { value: "invoices", label: "الفواتير" },
    ],
  },
  {
    value: "photos",
    label: "الصور",
    children: [
      { value: "trips", label: "الرحلات" },
      { value: "family", label: "العائلة" },
    ],
  },
  { value: "downloads", label: "التنزيلات" },
]

function markup(list: Node[]) {
  let html = ""
  for (const item of list)
    html += `
      <ui-tree-item value="${item.value}">
        <ui-tree-item-label>
          ${
            item.children
              ? `<ui-tree-item-indicator>${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}</ui-tree-item-indicator>`
              : `<span></span>`
          }
          ${item.label}
        </ui-tree-item-label>
        ${item.children ? `<ui-tree-group>${markup(item.children)}</ui-tree-group>` : ""}
      </ui-tree-item>`
  return html
}

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <ui-tree aria-label="الملفات" default-expanded="documents">
        ${markup(folders)}
      </ui-tree>
    </div>
  `
}
