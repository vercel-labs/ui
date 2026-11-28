import { Component, input } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  createTreeController,
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
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="settings.expandAll()">Expand All</button>
        <button type="button" (click)="settings.collapseAll()">
          Collapse All
        </button>
        <button type="button" (click)="onClick()">Find Two-Factor</button>
      </div>
      <div
        uiTree
        aria-label="Settings"
        [items]="sections"
        [controller]="settings"
      >
        <div appNodes [nodes]="sections"></div>
      </div>
    </div>
  `,
})
class Example {
  readonly sections: TreeItemData[] = [
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

  readonly settings = createTreeController()

  onClick() {
    this.settings.setValue("two-factor")
    this.settings.reveal("two-factor")
  }
}

export { Example, Nodes }
