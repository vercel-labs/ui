import { Component, input } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/angular/tree"

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
  readonly nodes = input.required<TreeItemData[]>()
}

@Component({
  imports: [Tree, Nodes],
  template: `
    <div
      uiTree
      aria-label="Folders"
      [items]="items"
      mode="multiple"
      [defaultValue]="['updates', 'website']"
      (beforeValueChange)="
        log($event.value.length + ' selected: ' + $event.value.join(', '))
      "
      [expandOnPress]="false"
      [defaultExpanded]="['inbox', 'projects']"
    >
      <div appNodes [nodes]="items"></div>
    </div>
  `,
})
class Example {
  readonly items: TreeItemData[] = [
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

  readonly log = useLog()
}

export { Example, Nodes }
