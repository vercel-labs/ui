import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/solid/collapsible"
import { For } from "solid-js"

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

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul>
      <For each={nodes}>
        {(node) => (
          <li>
            {node.children ? (
              <Collapsible defaultOpen={node.name === "components"}>
                <CollapsibleTrigger data-variant="ghost">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                  </svg>
                  <span>{node.name}</span>
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <Tree nodes={node.children} />
                </CollapsiblePanel>
              </Collapsible>
            ) : (
              <span data-slot="row">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                  <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                </svg>
                {node.name}
              </span>
            )}
          </li>
        )}
      </For>
    </ul>
  )
}

function Example() {
  return (
    <div>
      <Tree nodes={fileTree} />
    </div>
  )
}

export { Example }
