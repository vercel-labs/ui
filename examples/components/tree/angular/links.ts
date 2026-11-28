import { Component, input, signal } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Tree,
  type TreeAction,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeItemData,
} from "@ui-sdk/angular/tree"

const pages: TreeItemData[] = [
  {
    value: "getting-started",
    label: "Getting started",
    children: [
      { value: "introduction", label: "Introduction", href: "#introduction" },
      { value: "installation", label: "Installation", href: "#installation" },
    ],
  },
  {
    value: "components",
    label: "Components",
    children: [
      { value: "accordion", label: "Accordion", href: "#accordion" },
      { value: "dialog", label: "Dialog", href: "#dialog" },
      { value: "tree", label: "Tree", href: "#tree" },
    ],
  },
  { value: "changelog", label: "Changelog", href: "#changelog" },
]

const links = new Set(
  pages
    .flatMap((page) => [page, ...(page.children ?? [])])
    .filter((page) => page.href)
    .map((page) => page.value)
)

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
        @if (item.href) {
          <a uiTreeItemLabel [href]="item.href">{{ item.label }}</a>
        } @else {
          <span uiTreeItemLabel>
            @if (item.children) {
              <span uiTreeItemIndicator>
                <svg lucideChevronRight></svg>
              </span>
            }
            {{ item.label }}
          </span>
        }
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
      aria-label="Docs"
      [items]="pages"
      mode="none"
      [current]="current()"
      (action)="follow($event)"
    >
      <div appNodes [nodes]="pages"></div>
    </div>
  `,
})
class Example {
  readonly pages = pages

  readonly current = signal("tree")

  follow(action: TreeAction) {
    if (!links.has(action.value)) {
      return
    }
    action.event?.preventDefault()
    this.current.set(action.value)
  }
}

export { Example, Nodes }
