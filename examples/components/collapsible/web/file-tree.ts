import "@ui-sdk/web/collapsible"
import { ChevronRight, File, Folder, createElement } from "lucide"

type TreeNode = { name: string; children?: TreeNode[] }

const fileTree: TreeNode[] = [
  {
    name: "components",
    children: [
      { name: "ui", children: [{ name: "button.tsx" }, { name: "card.tsx" }, { name: "dialog.tsx" }] },
      { name: "header.tsx" },
      { name: "footer.tsx" },
    ],
  },
  { name: "lib", children: [{ name: "utils.ts" }] },
  { name: "hooks", children: [{ name: "use-media-query.ts" }, { name: "use-mobile.ts" }] },
  { name: "types", children: [{ name: "index.d.ts" }] },
  { name: "public", children: [{ name: "favicon.ico" }, { name: "logo.svg" }] },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
]

function tree(nodes: TreeNode[]) {
  let items = ""
  for (const node of nodes) {
    items += node.children
      ? `<li>
          <ui-collapsible${node.name === "components" ? " default-open" : ""}>
            <ui-collapsible-trigger>
              <button data-variant="ghost">
                ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}
                ${createElement(Folder, { "aria-hidden": "true" }).outerHTML}
                <span>${node.name}</span>
              </button>
            </ui-collapsible-trigger>
            <ui-collapsible-panel>
              ${tree(node.children)}
            </ui-collapsible-panel>
          </ui-collapsible>
        </li>`
      : `<li>
          <span data-slot="row">
            ${createElement(File, { "aria-hidden": "true" }).outerHTML}
            ${node.name}
          </span>
        </li>`
  }
  return `<ul>${items}</ul>`
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div>
      ${tree(fileTree)}
    </div>
  `
}

export { mount }
