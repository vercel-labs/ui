import { Component, input } from "@angular/core"
import { LucideChevronRight, LucideLoaderCircle } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  treeFromPaths,
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
    LucideLoaderCircle,
  ],
  host: { style: "display: contents" },
  template: `
    @for (item of nodes(); track item.value) {
      <div uiTreeItem [value]="item.value">
        <span uiTreeItemLabel #treeItemLabel="uiTreeItemLabel">
          @if (item.children) {
            <span uiTreeItemIndicator>
              <svg lucideChevronRight></svg>
            </span>
          }
          <span>{{ item.label }}</span>
          @if (treeItemLabel.state().pending) {
            <svg lucideLoaderCircle></svg>
          }
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
      aria-label="Project"
      [paths]="paths"
      [defaultExpanded]="['src']"
      defaultValue="src/index.ts"
      activation="automatic"
      (action)="$event.waitUntil(open($event.value))"
    >
      <div appNodes [nodes]="items"></div>
    </div>
  `,
})
class Example {
  readonly paths = [
    "src/index.ts",
    "src/lib/format.ts",
    "src/lib/parse.ts",
    "src/routes/home.tsx",
    "src/routes/about.tsx",
    "tests/",
    "package.json",
    "tsconfig.json",
  ]

  readonly items = treeFromPaths(this.paths)

  readonly files = new Set(this.paths.filter((path) => !path.endsWith("/")))

  readonly log = useLog()

  async open(value: string) {
    if (!this.files.has(value)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 600))
    this.log(`Opened ${value}`)
  }
}

export { Example, Nodes }
