import { Component, input } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/angular/tree"

@Component({
  selector: "[appNodes]",
  imports: [
    TreeGroup,
    TreeItem,
    TreeItemCheckbox,
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
          <span uiTreeItemCheckbox></span>
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
  readonly nodes = input.required<TreeItemData[]>()
}

@Component({
  imports: [Tree, Nodes],
  template: `
    <div
      uiTree
      aria-label="Stack"
      [items]="items"
      checkable
      mode="none"
      checkStrategy="trunk"
      [defaultChecked]="['react', 'postgres']"
      (beforeCheckedChange)="
        log('Checked ' + ($event.value.join(', ') || 'nothing'))
      "
      [defaultExpanded]="['frontend', 'backend', 'databases']"
    >
      <div appNodes [nodes]="items"></div>
    </div>
  `,
})
class Example {
  readonly items: TreeItemData[] = [
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

  readonly log = useLog()
}

export { Example, Nodes }
