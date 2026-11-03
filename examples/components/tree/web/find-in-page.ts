import type { TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"

const items: TreeItemData[] = [
  {
    value: "planets",
    label: "Planets",
    children: [
      { value: "mercury", label: "Mercury" },
      { value: "venus", label: "Venus" },
      { value: "earth", label: "Earth", children: [{ value: "moon", label: "The Moon" }] },
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
      { value: "pluto", label: "Pluto", children: [{ value: "charon", label: "Charon" }] },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tree aria-label="Solar system" hidden-until-found>
      <template>
        <ui-tree-item>
          <ui-tree-item-indicator></ui-tree-item-indicator>
          <ui-tree-item-label></ui-tree-item-label>
          <ui-tree-group></ui-tree-group>
        </ui-tree-item>
      </template>
    </ui-tree>
  `
  const tree = root.querySelector("ui-tree")!
  tree.items = items
}

export { mount }
