import { Component, input, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"
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
      <div uiTreeItem [value]="item.value" [disabled]="item.disabled">
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
  imports: [Switch, SwitchThumb, Tree, Nodes],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button uiSwitch [(checked)]="focusable">
            <span uiSwitchThumb></span>
          </button>
          Focusable when disabled
        </label>
      </div>
      <div
        uiTree
        aria-label="Plans"
        [items]="items"
        [defaultExpanded]="['plans']"
        [focusableWhenDisabled]="focusable()"
      >
        <div appNodes [nodes]="items"></div>
      </div>
    </div>
  `,
})
class Example {
  readonly items: TreeItemData[] = [
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

  readonly focusable = signal(true)
}

export { Example, Nodes }
