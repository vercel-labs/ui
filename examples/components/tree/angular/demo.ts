import { Component, input } from "@angular/core"
import {
  LucideChevronRight,
  LucideFile,
  LucideFolder,
  LucideFolderOpen,
} from "@lucide/angular"
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
    LucideFile,
    LucideFolder,
    LucideFolderOpen,
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
            <svg lucideFolder></svg>
            <svg lucideFolderOpen></svg>
          } @else {
            <svg lucideFile></svg>
          }
          <span>{{ item.label }}</span>
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
    <div
      uiTree
      aria-label="Files"
      [defaultExpanded]="['app']"
      defaultValue="app/page.tsx"
    >
      <div appNodes [nodes]="files"></div>
    </div>
  `,
})
class Example {
  readonly files: Node[] = [
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
    { value: "components.json", label: "components.json" },
    { value: "package.json", label: "package.json" },
    { value: "README.md", label: "README.md" },
  ]
}

export { Example, Nodes }
