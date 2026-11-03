"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
  treeFromPaths,
} from "@ui-sdk/react/tree"
import type { TreeItemData } from "@ui-sdk/react/tree"
import { ChevronRightIcon, LoaderCircleIcon } from "lucide-react"
import * as React from "react"

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

function Items({ items }: { items: TreeItemData[] }) {
  return items.map((item) => (
    <TreeItem key={item.value} value={item.value}>
      <TreeItemLabel>
        {(state) => (
          <>
            {item.children ? (
              <TreeItemIndicator>
                <ChevronRightIcon aria-hidden="true" />
              </TreeItemIndicator>
            ) : (
              <span />
            )}
            <span>{item.label}</span>
            {state.pending && <LoaderCircleIcon aria-hidden="true" />}
          </>
        )}
      </TreeItemLabel>
      {item.children && (
        <TreeGroup>
          <Items items={item.children} />
        </TreeGroup>
      )}
    </TreeItem>
  ))
}

function Example() {
  const [selected, setSelected] = React.useState<string | null>("src/index.ts")
  const [opened, setOpened] = React.useState<string | null>(null)
  return (
    <div data-slot="stack">
      <Tree
        aria-label="Project"
        paths={paths}
        defaultExpanded={["src"]}
        value={selected}
        onValueChange={setSelected}
        activation="automatic"
        onAction={async (value) => {
          if (!files.has(value)) return
          await new Promise((resolve) => setTimeout(resolve, 600))
          setOpened(value)
        }}
      >
        <Items items={items} />
      </Tree>
      <div data-slot="stack">
        <span data-slot="hint">{selected ?? "Nothing selected"}</span>
        <span>{opened ? `Opened ${opened}` : "Press Enter to open a file."}</span>
      </div>
    </div>
  )
}

export { Example }
