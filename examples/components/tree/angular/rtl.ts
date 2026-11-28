import { Component, input } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/angular/tree"

type Node = { value: string; label: string; children?: Node[] }

@Component({
  selector: "[appNodes]",
  imports: [
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
    LucideChevronRight,
  ],
  host: { style: "display: contents" },
  template: `
    @for (item of nodes(); track item.value) {
      <div uiTreeItem [value]="item.value">
        <span uiTreeItemLabel>
          @if (item.children) {
            <span uiTreeItemIndicator>
              <svg lucideChevronRight></svg>
            </span>
          }
          {{ item.label }}
        </span>
        @if (item.children) {
          <div uiTreeGroup>
            <div appNodes [nodes]="item.children"></div>
          </div>
        }
      </div>
    }
  `,
})
class Nodes {
  readonly nodes = input.required<Node[]>()
}

@Component({
  imports: [Tree, Nodes],
  template: `
    <div dir="rtl">
      <div uiTree aria-label="الملفات" [defaultExpanded]="['documents']">
        <div appNodes [nodes]="folders"></div>
      </div>
    </div>
  `,
})
class Example {
  readonly folders: Node[] = [
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
}

export { Example, Nodes }
