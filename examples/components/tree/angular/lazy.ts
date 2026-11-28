import { Component, input, signal } from "@angular/core"
import {
  LucideChevronRight,
  LucideLoaderCircle,
  LucideRotateCw,
} from "@lucide/angular"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  type TreeAnnouncement,
} from "@ui-sdk/angular/tree"

type Node = { value: string; label: string; branch?: boolean }

@Component({
  selector: "[appNodes]",
  imports: [
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
    LucideChevronRight,
    LucideLoaderCircle,
    LucideRotateCw,
  ],
  host: { style: "display: contents" },
  template: `
    @for (item of nodes(); track item.value) {
      <div uiTreeItem [value]="item.value" [branch]="item.branch">
        <span uiTreeItemLabel>
          @if (item.branch) {
            <span uiTreeItemIndicator #treeItemIndicator="uiTreeItemIndicator">
              @if (treeItemIndicator.state().loading) {
                <svg lucideLoaderCircle></svg>
              } @else if (treeItemIndicator.state().failed) {
                <svg lucideRotateCw></svg>
              } @else {
                <svg lucideChevronRight></svg>
              }
            </span>
          }
          {{ item.label }}
        </span>
        @if (loaded()[item.value]) {
          <div uiTreeGroup>
            <div
              appNodes
              [nodes]="loaded()[item.value]"
              [loaded]="loaded()"
            ></div>
          </div>
        }
      </div>
    }
  `,
})
class Nodes {
  readonly nodes = input.required<Node[]>()
  readonly loaded = input.required<Record<string, Node[]>>()
}

@Component({
  imports: [Tree, Nodes],
  template: `
    <div
      uiTree
      aria-label="Database"
      [loadChildren]="loadChildren"
      [announcement]="announcement"
    >
      <div appNodes [nodes]="top" [loaded]="loaded()"></div>
    </div>
  `,
})
class Example {
  readonly top: Node[] = [
    { value: "users", label: "users", branch: true },
    { value: "orders", label: "orders", branch: true },
    { value: "archive", label: "archive", branch: true },
  ]

  archiveAsked = false

  async fetchChildren(value: string, signal: AbortSignal) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, 800)
      signal.addEventListener(
        "abort",
        () => (clearTimeout(timer), reject(signal.reason))
      )
    })
    if (value === "archive" && !this.archiveAsked) {
      this.archiveAsked = true
      throw new Error("Network error")
    }
    return Array.from({ length: 3 }, (_, index) => ({
      value: `${value}/${index + 1}`,
      label: `${value.slice(0, -1)}_${index + 1}.json`,
    }))
  }

  readonly loaded = signal<Record<string, Node[]>>({})

  readonly loadChildren = async (
    value: string,
    { signal }: { signal: AbortSignal }
  ) => {
    const children = await this.fetchChildren(value, signal)
    this.loaded.update((loaded) => ({ ...loaded, [value]: children }))
  }

  readonly announcement = ({ type, label }: TreeAnnouncement) =>
    ({
      expanded: "Expanded",
      collapsed: "Collapsed",
      loading: `Loading ${label}`,
      "load-failed": `${label} didn't load. Try again.`,
    })[type]
}

export { Example, Nodes }
