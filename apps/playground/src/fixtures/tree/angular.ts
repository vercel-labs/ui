import { Component, inject, input } from "@angular/core"
import {
  createTreeController,
  Tree,
  type TreeAction,
  type TreeExpandedChange,
  TreeGroup,
  TreeItem,
  TreeItemCheckbox,
  TreeItemIndicator,
  TreeItemLabel,
} from "@ui-sdk/angular/tree"
import { treeOptions } from "../../../../../tests/fixtures/page"
import {
  describeTree,
  treeFixture,
  type TreeFixtureItem,
} from "../../../../../tests/fixtures/tree"
import { DATA, mountAngular, state } from "../../angular-mount"

@Component({
  selector: "[fixtureItems]",
  host: { style: "display: contents" },
  imports: [
    TreeGroup,
    TreeItem,
    TreeItemCheckbox,
    TreeItemIndicator,
    TreeItemLabel,
  ],
  template: `
    @for (item of items(); track item.value) {
      <div
        uiTreeItem
        class="tree-item"
        [value]="item.value"
        [disabled]="item.disabled"
      >
        @if (item.children) {
          <span uiTreeItemIndicator class="tree-indicator">▸</span>
        }
        @if (checkable()) {
          <span uiTreeItemCheckbox class="tree-checkbox"></span>
        }
        @if (item.href) {
          <a uiTreeItemLabel class="tree-label" [href]="item.href">{{
            item.label
          }}</a>
        } @else {
          <span uiTreeItemLabel class="tree-label">{{ item.label }}</span>
        }
        @if (item.children) {
          <div *uiTreeGroup class="tree-group">
            <div [fixtureItems]="item.children" [checkable]="checkable()"></div>
          </div>
        }
      </div>
    }
  `,
})
class Items {
  readonly items = input.required<TreeFixtureItem[]>({ alias: "fixtureItems" })
  readonly checkable = input(false)
}

@Component({
  imports: [Items, Tree],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTree
        class="tree"
        [attr.aria-label]="f.label"
        [items]="data ? f.items : undefined"
        [controller]="controller"
        [mode]="options.mode"
        [defaultValue]="options.defaultValue"
        [defaultExpanded]="options.defaultExpanded"
        [checkable]="options.checkable"
        [checkStrategy]="options.checkStrategy"
        [current]="options.current"
        [activation]="options.activation"
        [disabled]="options.disabled"
        [keepMounted]="options.keepMounted"
        [hiddenUntilFound]="options.hiddenUntilFound"
        (valueChange)="action.set(describe('selected', $event))"
        (beforeExpandedChange)="onExpandedChange($event)"
        (checkedChange)="action.set(describe('checked', $event))"
        (action)="onAction($event)"
      >
        <div [fixtureItems]="f.items" [checkable]="options.checkable"></div>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <button (click)="controller.expandAll()">Expand all</button>
      <button (click)="controller.collapseAll()">Collapse all</button>
      <button (click)="controller.reveal('dialog.tsx')">Reveal dialog</button>
    </div>
  `,
})
class Fixture {
  readonly f = treeFixture
  readonly data = inject(DATA)
  readonly describe = describeTree
  readonly controller = createTreeController()
  readonly options = treeOptions()
  readonly action = state("")

  onExpandedChange(change: TreeExpandedChange) {
    const { cancel } = this.options
    if (
      cancel &&
      change.value.includes(cancel) &&
      !this.controller.isExpanded(cancel)
    ) {
      return change.cancel()
    }
    this.action.set(describeTree("expanded", change.value))
  }

  onAction(action: TreeAction) {
    this.action.set(describeTree("action", action.value))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, Items, mount }
