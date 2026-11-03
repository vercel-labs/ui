import { treeFromPaths, type TreeItemData } from "@ui-sdk/core/tree"
import "@ui-sdk/web/tree"
import { ChevronRight, createElement, LoaderCircle, type IconNode } from "lucide"

const paths = [
  "src/index.ts",
  "src/lib/format.ts",
  "src/lib/parse.ts",
  "src/routes/home.tsx",
  "src/routes/about.tsx",
  "tests/",
  "package.json",
  "tsconfig.json",
]

const items = treeFromPaths(paths)
const files = new Set(paths.filter((path) => !path.endsWith("/")))

const icon = (node: IconNode) => createElement(node, { "aria-hidden": "true" }).outerHTML

function markup(list: TreeItemData[]) {
  let html = ""
  for (const item of list)
    html += `
      <ui-tree-item value="${item.value}">
        <ui-tree-item-label>
          ${
            item.children
              ? `<ui-tree-item-indicator>${icon(ChevronRight)}</ui-tree-item-indicator>`
              : `<span></span>`
          }
          <span>${item.label}</span>
          ${createElement(LoaderCircle, { "aria-hidden": "true", "data-show": "pending" }).outerHTML}
        </ui-tree-item-label>
        ${item.children ? `<ui-tree-group>${markup(item.children)}</ui-tree-group>` : ""}
      </ui-tree-item>`
  return html
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tree aria-label="Project" default-expanded="src" default-value="src/index.ts" activation="automatic">
        ${markup(items)}
      </ui-tree>
      <div data-slot="stack">
        <span data-slot="hint">src/index.ts</span>
        <span>Press Enter to open a file.</span>
      </div>
    </div>
  `
  const tree = root.querySelector("ui-tree")!
  const [selected, opened] = root.querySelectorAll("div > div > span")
  tree.paths = paths
  tree.addEventListener("valuechange", (event) => {
    selected.textContent = (event.detail.value as string | null) ?? "Nothing selected"
  })
  tree.addEventListener("action", (event) => {
    const { value, waitUntil } = event.detail
    if (!files.has(value)) return
    waitUntil(
      new Promise((resolve) => setTimeout(resolve, 600)).then(() => {
        opened.textContent = `Opened ${value}`
      }),
    )
  })
}

export { mount }
