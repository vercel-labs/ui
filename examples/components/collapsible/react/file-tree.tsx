import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react"

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
      {nodes.map((node) => (
        <li key={node.name}>
          {node.children ? (
            <Collapsible defaultOpen={node.name === "components"}>
              <CollapsibleTrigger data-variant="ghost">
                <ChevronRightIcon />
                <FolderIcon />
                <span>{node.name}</span>
              </CollapsibleTrigger>
              <CollapsiblePanel>
                <Tree nodes={node.children} />
              </CollapsiblePanel>
            </Collapsible>
          ) : (
            <span data-slot="row">
              <FileIcon />
              {node.name}
            </span>
          )}
        </li>
      ))}
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
