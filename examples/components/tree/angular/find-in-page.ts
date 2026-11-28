import { Component, input } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
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
    <div uiTree aria-label="Solar system" [items]="items" hiddenUntilFound>
      <div appNodes [nodes]="items"></div>
    </div>
  `,
})
class Example {
  readonly items: TreeItemData[] = [
    {
      value: "planets",
      label: "Planets",
      children: [
        { value: "mercury", label: "Mercury" },
        { value: "venus", label: "Venus" },
        {
          value: "earth",
          label: "Earth",
          children: [{ value: "moon", label: "The Moon" }],
        },
        {
          value: "mars",
          label: "Mars",
          children: [
            { value: "phobos", label: "Phobos" },
            { value: "deimos", label: "Deimos" },
          ],
        },
      ],
    },
    {
      value: "dwarf-planets",
      label: "Dwarf planets",
      children: [
        { value: "ceres", label: "Ceres" },
        {
          value: "pluto",
          label: "Pluto",
          children: [{ value: "charon", label: "Charon" }],
        },
      ],
    },
  ]
}

export { Example, Nodes }
